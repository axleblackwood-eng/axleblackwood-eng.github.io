import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import {
  Plus, Pencil, Trash2, Upload, Download, X, Image as ImageIcon, Eye, Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Markdown from "@/components/Markdown";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const COLORS = [
  "#7C9082", "#A96F5D", "#D4A373", "#8C4A4A",
  "#6B85A6", "#B58FB5", "#C9A66B", "#5D7B7C",
];

const emptyForm = {
  name: "",
  pronouns: "",
  role: "",
  description: "",
  color: "#7C9082",
  avatar_url: "",
};

const resolveAvatar = (url) => {
  if (!url) return "";
  if (url.startsWith("/api/")) return `${BACKEND_URL}${url}`;
  return url;
};

export default function Headmates() {
  const [alters, setAlters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [descPreview, setDescPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);
  const avatarInput = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const load = async () => {
    const res = await api.get("/alters");
    setAlters(res.data);
  };
  useEffect(() => {
    load();
  }, []);

  const startEdit = (a) => {
    setEditing(a.id);
    setForm({
      name: a.name,
      pronouns: a.pronouns || "",
      role: a.role || "",
      description: a.description || "",
      color: a.color || "#7C9082",
      avatar_url: a.avatar_url || "",
    });
    setShowForm(true);
    setDescPreview(false);
  };

  // open edit form when navigated from member-detail with editId
  useEffect(() => {
    const id = location.state?.editId;
    if (id && alters.length > 0) {
      const a = alters.find((x) => x.id === id);
      if (a) startEdit(a);
      window.history.replaceState({}, "");
    }
  }, [alters, location.state]);

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error("Name is needed");
      return;
    }
    if (editing) {
      await api.put(`/alters/${editing}`, form);
      toast.success("Updated");
    } else {
      await api.post("/alters", form);
      toast.success("Headmate added");
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    load();
  };

  const remove = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Remove this headmate?")) return;
    await api.delete(`/alters/${id}`);
    load();
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const res = await api.post("/import/simply-plural", { data });
      toast.success(`Imported ${res.data.imported} headmates`);
      load();
    } catch (err) {
      toast.error("Couldn't read that file. Make sure it's a Simply Plural JSON export.");
    }
    e.target.value = "";
  };

  const exportData = async () => {
    const res = await api.get("/export");
    const blob = new Blob([JSON.stringify(res.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pluralhaven-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/upload/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, avatar_url: res.data.url }));
      toast.success("Avatar uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-10" data-testid="headmates-page">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <span className="label-eyebrow">your inner system</span>
          <h1 className="font-serif text-5xl font-light mt-3">Headmates</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInput}
            onChange={handleImport}
            className="hidden"
            data-testid="import-file-input"
          />
          <button
            data-testid="import-button"
            className="btn-ghost"
            onClick={() => fileInput.current?.click()}
          >
            <Upload size={14} /> Simply Plural import
          </button>
          <button data-testid="export-button" className="btn-ghost" onClick={exportData}>
            <Download size={14} /> Export
          </button>
          <button
            data-testid="add-headmate-button"
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setShowForm(true);
              setDescPreview(false);
            }}
          >
            <Plus size={15} /> Add headmate
          </button>
        </div>
      </header>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface p-7 space-y-5"
          data-testid="headmate-form"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">
              {editing ? "Edit headmate" : "New headmate"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="btn-ghost !p-2"
            >
              <X size={15} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-eyebrow">name</label>
              <input
                data-testid="alter-name-input"
                className="input-cozy mt-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label-eyebrow">pronouns</label>
              <input
                data-testid="alter-pronouns-input"
                className="input-cozy mt-2"
                placeholder="they/them"
                value={form.pronouns}
                onChange={(e) => setForm({ ...form, pronouns: e.target.value })}
              />
            </div>
            <div>
              <label className="label-eyebrow">role</label>
              <input
                data-testid="alter-role-input"
                className="input-cozy mt-2"
                placeholder="protector, little, host…"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
            <div>
              <label className="label-eyebrow">avatar</label>
              <div className="mt-2 flex items-center gap-3">
                <span
                  className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center font-serif text-xl"
                  style={{
                    background: form.color + "22",
                    color: form.color,
                    border: `1.5px solid ${form.color}66`,
                  }}
                >
                  {form.avatar_url ? (
                    <img
                      src={resolveAvatar(form.avatar_url)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    form.name?.[0] || "?"
                  )}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInput}
                  onChange={uploadAvatar}
                  className="hidden"
                  data-testid="avatar-file-input"
                />
                <button
                  type="button"
                  data-testid="upload-avatar-button"
                  onClick={() => avatarInput.current?.click()}
                  disabled={uploading}
                  className="btn-ghost !text-xs"
                >
                  <ImageIcon size={12} />
                  {uploading ? "uploading…" : "upload"}
                </button>
                {form.avatar_url && (
                  <button
                    type="button"
                    data-testid="clear-avatar-button"
                    onClick={() => setForm({ ...form, avatar_url: "" })}
                    className="btn-ghost !text-xs"
                  >
                    <X size={12} /> clear
                  </button>
                )}
              </div>
              <input
                data-testid="alter-avatar-input"
                className="input-cozy mt-2"
                placeholder="or paste an image URL"
                value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="label-eyebrow">description (md / html)</label>
                <button
                  type="button"
                  data-testid="toggle-desc-preview"
                  onClick={() => setDescPreview((p) => !p)}
                  className="btn-ghost !py-1.5 !text-xs"
                >
                  {descPreview ? <Edit3 size={12} /> : <Eye size={12} />}
                  {descPreview ? "edit" : "preview"}
                </button>
              </div>
              {descPreview ? (
                <div
                  className="mt-2 input-cozy min-h-[8rem]"
                  data-testid="desc-preview"
                >
                  <Markdown>{form.description || "*Nothing yet.*"}</Markdown>
                </div>
              ) : (
                <textarea
                  data-testid="alter-description-input"
                  className="input-cozy mt-2 font-mono text-sm"
                  rows={6}
                  value={form.description}
                  placeholder={`A soft **protector** of the system.\n\n- shows up when we're scared\n- loves rainy afternoons`}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="label-eyebrow">color</label>
              <div className="mt-3 flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    data-testid={`color-swatch-${c}`}
                    onClick={() => setForm({ ...form, color: c })}
                    className="h-9 w-9 rounded-full transition-transform"
                    style={{
                      background: c,
                      transform: form.color === c ? "scale(1.15)" : "scale(1)",
                      boxShadow:
                        form.color === c
                          ? `0 0 0 3px var(--bg-main), 0 0 0 5px ${c}`
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              data-testid="save-alter-button"
              className="btn-primary"
              onClick={submit}
            >
              Save
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {alters.length === 0 ? (
        <div className="surface-flat p-10 text-center">
          <p className="text-[color:var(--text-secondary)]">
            No headmates yet. Add the first one — or import your Simply Plural file.
          </p>
        </div>
      ) : (
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-testid="headmates-grid"
        >
          {alters.map((a) => (
            <motion.div
              key={a.id}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/headmates/${a.id}`)}
              className="surface p-6 flex flex-col gap-4 cursor-pointer"
              data-testid={`headmate-card-${a.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center font-serif text-xl"
                    style={{
                      background: a.color + "22",
                      color: a.color,
                      border: `1.5px solid ${a.color}66`,
                    }}
                  >
                    {a.avatar_url ? (
                      <img
                        src={resolveAvatar(a.avatar_url)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      a.name?.[0]
                    )}
                  </span>
                  <div>
                    <p className="font-serif text-2xl leading-tight">{a.name}</p>
                    {a.pronouns && (
                      <p className="text-xs text-[color:var(--text-secondary)]">
                        {a.pronouns}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    data-testid={`edit-headmate-${a.id}`}
                    className="btn-ghost !p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(a);
                    }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    data-testid={`delete-headmate-${a.id}`}
                    className="btn-ghost !p-2"
                    onClick={(e) => remove(e, a.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {a.role && (
                <span
                  className="self-start text-xs px-3 py-1 rounded-full"
                  style={{
                    background: a.color + "22",
                    color: a.color,
                  }}
                >
                  {a.role}
                </span>
              )}
              {a.description && (
                <div className="text-sm text-[color:var(--text-secondary)] leading-relaxed line-clamp-3">
                  <Markdown>{a.description.slice(0, 200)}</Markdown>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
