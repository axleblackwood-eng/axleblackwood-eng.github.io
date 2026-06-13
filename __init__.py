import { useEffect, useState } from "react";
import { api, formatTime } from "@/lib/api";
import { Plus, Trash2, X, Tag } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const MOODS = [
  { v: "calm", label: "calm" },
  { v: "anxious", label: "anxious" },
  { v: "low", label: "low" },
  { v: "bright", label: "bright" },
  { v: "foggy", label: "foggy" },
  { v: "dissociated", label: "dissociated" },
];

const SYMPTOM_SUGGEST = [
  "dissociation",
  "memory gap",
  "fatigue",
  "anxiety",
  "depersonalization",
  "derealization",
  "headache",
  "switch fatigue",
];

const emptyForm = {
  title: "",
  body: "",
  mood: "",
  symptoms: [],
  alter_id: "",
  shared_with_alters: true,
};

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [alters, setAlters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [filterMood, setFilterMood] = useState("");
  const [filterAlter, setFilterAlter] = useState("");
  const [filterSymptom, setFilterSymptom] = useState("");

  const load = async () => {
    const [j, a] = await Promise.all([api.get("/journal"), api.get("/alters")]);
    setEntries(j.data);
    setAlters(a.data);
  };
  useEffect(() => {
    load();
  }, []);

  const filteredEntries = entries.filter((e) => {
    if (filterMood && e.mood !== filterMood) return false;
    if (filterAlter && e.alter_id !== filterAlter) return false;
    if (filterSymptom && !(e.symptoms || []).includes(filterSymptom)) return false;
    return true;
  });

  const allSymptoms = Array.from(
    new Set(entries.flatMap((e) => e.symptoms || []))
  ).sort();

  const toggleSymptom = (s) => {
    setForm((f) => ({
      ...f,
      symptoms: f.symptoms.includes(s)
        ? f.symptoms.filter((x) => x !== s)
        : [...f.symptoms, s],
    }));
  };

  const submit = async () => {
    if (!form.body.trim()) {
      toast.error("Write a little something");
      return;
    }
    await api.post("/journal", {
      ...form,
      alter_id: form.alter_id || null,
    });
    toast.success("Entry saved");
    setShowForm(false);
    setForm(emptyForm);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this entry?")) return;
    await api.delete(`/journal/${id}`);
    load();
  };

  const alterName = (id) => alters.find((a) => a.id === id)?.name;
  const alterColor = (id) => alters.find((a) => a.id === id)?.color || "#7C9082";

  return (
    <div className="space-y-10" data-testid="journal-page">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <span className="label-eyebrow">a soft place to write</span>
          <h1 className="font-serif text-5xl font-light mt-3">Journal</h1>
        </div>
        <button
          data-testid="new-entry-button"
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={15} /> New entry
        </button>
      </header>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface p-7 space-y-5"
          data-testid="journal-form"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">New entry</h2>
            <button onClick={() => setShowForm(false)} className="btn-ghost !p-2">
              <X size={15} />
            </button>
          </div>
          <div>
            <label className="label-eyebrow">title (optional)</label>
            <input
              data-testid="journal-title-input"
              className="input-cozy mt-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="just a thought"
            />
          </div>
          <div>
            <label className="label-eyebrow">how it feels</label>
            <textarea
              data-testid="journal-body-input"
              className="input-cozy mt-2"
              rows={6}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Take your time…"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label-eyebrow">mood</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.v}
                    data-testid={`mood-${m.v}`}
                    onClick={() => setForm({ ...form, mood: m.v })}
                    className="px-3 py-1.5 rounded-full text-sm border transition-all"
                    style={{
                      borderColor:
                        form.mood === m.v
                          ? "var(--brand-primary)"
                          : "var(--border-default)",
                      background:
                        form.mood === m.v
                          ? "rgba(124,144,130,0.18)"
                          : "var(--bg-flat)",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-eyebrow">written by</label>
              <select
                data-testid="journal-alter-select"
                className="input-cozy mt-2"
                value={form.alter_id || ""}
                onChange={(e) =>
                  setForm({ ...form, alter_id: e.target.value })
                }
              >
                <option value="">— anyone / system —</option>
                {alters.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label-eyebrow">symptoms</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {SYMPTOM_SUGGEST.map((s) => (
                <button
                  key={s}
                  data-testid={`symptom-${s.replace(/\s+/g, "-")}`}
                  onClick={() => toggleSymptom(s)}
                  className="px-3 py-1.5 rounded-full text-sm border transition-all flex items-center gap-1.5"
                  style={{
                    borderColor: form.symptoms.includes(s)
                      ? "var(--brand-accent)"
                      : "var(--border-default)",
                    background: form.symptoms.includes(s)
                      ? "rgba(169,111,93,0.18)"
                      : "var(--bg-flat)",
                  }}
                >
                  <Tag size={11} /> {s}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                data-testid="custom-symptom-input"
                className="input-cozy"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="add a custom symptom"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    toggleSymptom(tagInput.trim());
                    setTagInput("");
                  }
                }}
              />
            </div>
            {form.symptoms.length > 0 && (
              <p className="text-xs text-[color:var(--text-secondary)] mt-3">
                selected: {form.symptoms.join(", ")}
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
            <input
              data-testid="shared-checkbox"
              type="checkbox"
              checked={form.shared_with_alters}
              onChange={(e) =>
                setForm({ ...form, shared_with_alters: e.target.checked })
              }
            />
            Shared with the whole system (other alters can see it)
          </label>
          <div className="flex gap-3">
            <button
              data-testid="save-journal-button"
              className="btn-primary"
              onClick={submit}
            >
              Save entry
            </button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {entries.length > 0 && (
        <section
          className="surface-flat p-5 space-y-4"
          data-testid="journal-filters"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="label-eyebrow">filter by</span>
            {(filterMood || filterAlter || filterSymptom) && (
              <button
                data-testid="clear-filters"
                onClick={() => {
                  setFilterMood("");
                  setFilterAlter("");
                  setFilterSymptom("");
                }}
                className="text-xs text-[color:var(--brand-accent)]"
              >
                clear all
              </button>
            )}
          </div>
          <div>
            <p className="text-xs text-[color:var(--text-secondary)] mb-2">mood</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.v}
                  data-testid={`filter-mood-${m.v}`}
                  onClick={() => setFilterMood(filterMood === m.v ? "" : m.v)}
                  className="px-3 py-1.5 rounded-full text-xs border"
                  style={{
                    borderColor:
                      filterMood === m.v
                        ? "var(--brand-primary)"
                        : "var(--border-default)",
                    background:
                      filterMood === m.v
                        ? "rgba(124,144,130,0.15)"
                        : "transparent",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          {alters.length > 0 && (
            <div>
              <p className="text-xs text-[color:var(--text-secondary)] mb-2">
                written by
              </p>
              <div className="flex flex-wrap gap-2">
                {alters.map((a) => (
                  <button
                    key={a.id}
                    data-testid={`filter-alter-${a.id}`}
                    onClick={() =>
                      setFilterAlter(filterAlter === a.id ? "" : a.id)
                    }
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border"
                    style={{
                      borderColor:
                        filterAlter === a.id ? a.color : "var(--border-default)",
                      background:
                        filterAlter === a.id
                          ? a.color + "22"
                          : "transparent",
                    }}
                  >
                    <span className="dot" style={{ background: a.color }} />
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {allSymptoms.length > 0 && (
            <div>
              <p className="text-xs text-[color:var(--text-secondary)] mb-2">
                symptom
              </p>
              <div className="flex flex-wrap gap-2">
                {allSymptoms.map((s) => (
                  <button
                    key={s}
                    data-testid={`filter-symptom-${s.replace(/\s+/g, "-")}`}
                    onClick={() =>
                      setFilterSymptom(filterSymptom === s ? "" : s)
                    }
                    className="px-3 py-1.5 rounded-full text-xs border"
                    style={{
                      borderColor:
                        filterSymptom === s
                          ? "var(--brand-accent)"
                          : "var(--border-default)",
                      background:
                        filterSymptom === s
                          ? "rgba(169,111,93,0.15)"
                          : "transparent",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {entries.length === 0 ? (
        <div className="surface-flat p-10 text-center text-[color:var(--text-secondary)]">
          No entries yet. Write something — even just a word.
        </div>
      ) : (
        <div className="space-y-5" data-testid="journal-entries">
          {filteredEntries.length === 0 && (
            <div className="surface-flat p-6 text-sm text-[color:var(--text-secondary)] text-center">
              No entries match these filters.
            </div>
          )}
          {filteredEntries.map((e) => (
            <motion.article
              key={e.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface p-7"
              data-testid={`journal-entry-${e.id}`}
            >
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  {e.alter_id && (
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: alterColor(e.alter_id) + "22",
                        color: alterColor(e.alter_id),
                      }}
                    >
                      {alterName(e.alter_id) || "alter"}
                    </span>
                  )}
                  {e.mood && (
                    <span className="text-xs text-[color:var(--brand-primary)]">
                      · {e.mood}
                    </span>
                  )}
                  {!e.shared_with_alters && (
                    <span className="text-xs text-[color:var(--brand-danger)]">
                      · private
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[color:var(--text-disabled)]">
                    {formatTime(e.created_at)}
                  </span>
                  <button
                    data-testid={`delete-journal-${e.id}`}
                    className="btn-ghost !p-2"
                    onClick={() => remove(e.id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              {e.title && (
                <h3 className="font-serif text-2xl mt-3">{e.title}</h3>
              )}
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[color:var(--text-primary)]/90">
                {e.body}
              </p>
              {e.symptoms?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {e.symptoms.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2.5 py-1 rounded-full border"
                      style={{ borderColor: "rgba(169,111,93,0.4)", color: "var(--brand-accent)" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
