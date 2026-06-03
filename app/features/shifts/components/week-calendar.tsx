import { useState } from "react";
import { Plus, Pencil, Trash2, AlertTriangle, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useConfigurables } from "~/modules/configurables";
import { ShiftStatus, type BaristaShift, type CreateShiftDto, type UpdateShiftDto } from "../api/shifts.model";
import { ShiftForm } from "./shift-form";
import { useShifts } from "../hooks/use-shifts";

function getWeekDays(weekStart: string): string[] {
  const days: string[] = [];
  const start = new Date(weekStart + "T00:00:00");
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function formatDayLabel(dateStr: string): { day: string; num: string; isToday: boolean } {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date().toISOString().split("T")[0];
  return {
    day: d.toLocaleDateString("en-US", { weekday: "short" }),
    num: d.toLocaleDateString("en-US", { day: "numeric" }),
    isToday: dateStr === today,
  };
}

function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(weekStart + "T00:00:00");
  end.setDate(end.getDate() + 6);
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

type ModalState =
  | { type: "none" }
  | { type: "add"; date: string }
  | { type: "edit"; shift: BaristaShift }
  | { type: "delete"; shift: BaristaShift };

function ShiftCard({
  shift,
  onEdit,
  onDelete,
  primaryColor,
  secondaryColor,
  dangerColor,
  warningColor,
}: {
  shift: BaristaShift;
  onEdit: () => void;
  onDelete: () => void;
  primaryColor: string;
  secondaryColor: string;
  dangerColor: string;
  warningColor: string;
}) {
  const statusColors: Record<ShiftStatus, { bg: string; border: string }> = {
    [ShiftStatus.Scheduled]: { bg: `${primaryColor}12`, border: `${primaryColor}40` },
    [ShiftStatus.Covered]: { bg: "#4A7C5910", border: "#4A7C5950" },
    [ShiftStatus.Uncovered]: { bg: `${dangerColor}12`, border: `${dangerColor}50` },
    [ShiftStatus.Completed]: { bg: "#8888880D", border: "#88888840" },
  };

  const { bg, border } = statusColors[shift.status] ?? statusColors[ShiftStatus.Scheduled];

  return (
    <div
      className="rounded-lg px-2.5 py-2 text-xs border group relative"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-semibold text-gray-800 truncate">{shift.barista_name}</span>
            {shift.is_peak_hour && (
              <Star className="w-2.5 h-2.5 flex-shrink-0" style={{ color: warningColor, fill: warningColor }} />
            )}
          </div>
          <div className="text-gray-500 mt-0.5">
            {shift.start_time}–{shift.end_time}
          </div>
          <div className="text-gray-400 truncate">{shift.role}</div>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-0.5 rounded hover:bg-blue-100 text-blue-500"
          >
            <Pencil className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-0.5 rounded hover:bg-red-100 text-red-500"
          >
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function WeekCalendar() {
  const { config, loading: cfgLoading } = useConfigurables();
  const primaryColor = cfgLoading ? "#3B1F0A" : (config?.brandColor?.primary ?? "#3B1F0A");
  const secondaryColor = cfgLoading ? "#C8832A" : (config?.brandColor?.secondary ?? "#C8832A");
  const dangerColor = cfgLoading ? "#C0392B" : (config?.dangerColor ?? "#C0392B");
  const warningColor = cfgLoading ? "#E8A020" : (config?.warningColor ?? "#E8A020");
  const borderColor = cfgLoading ? "#E8DDD0" : (config?.borderColor ?? "#E8DDD0");

  const {
    weekStart,
    shifts,
    summary,
    loading,
    error,
    createShift,
    updateShift,
    deleteShift,
    prevWeek,
    nextWeek,
    goToCurrentWeek,
  } = useShifts();

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [actionLoading, setActionLoading] = useState(false);

  const weekDays = getWeekDays(weekStart);

  async function handleCreate(date: string, data: CreateShiftDto) {
    setActionLoading(true);
    const res = await createShift({ ...data, date });
    setActionLoading(false);
    if (res.success) setModal({ type: "none" });
    else alert(res.message ?? "Failed to add shift");
  }

  async function handleUpdate(shift: BaristaShift, data: Partial<CreateShiftDto>) {
    setActionLoading(true);
    const res = await updateShift(shift.id, data as UpdateShiftDto);
    setActionLoading(false);
    if (res.success) setModal({ type: "none" });
    else alert(res.message ?? "Failed to update shift");
  }

  async function handleDelete(shift: BaristaShift) {
    setActionLoading(true);
    await deleteShift(shift.id);
    setActionLoading(false);
    setModal({ type: "none" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: primaryColor }} />
          <p className="text-sm text-gray-500">Loading shifts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary Row */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Shifts", value: summary.totalShifts, color: primaryColor },
            { label: "Covered", value: summary.coveredShifts, color: "#4A7C59" },
            { label: "Uncovered", value: summary.uncoveredShifts, color: dangerColor },
            { label: "Peak Hour", value: summary.peakHourShifts, color: warningColor },
          ].map((s) => (
            <Card
              key={s.label}
              className="p-3 rounded-xl text-center shadow-sm"
              style={{ borderColor }}
            >
              <div className="text-xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Uncovered Shifts Alert */}
      {summary && summary.uncoveredShifts > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 text-sm"
          style={{
            borderLeftColor: dangerColor,
            backgroundColor: `${dangerColor}10`,
            color: dangerColor,
          }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>{summary.uncoveredShifts} shift{summary.uncoveredShifts > 1 ? "s" : ""} uncovered</strong> this week.
            Review and assign coverage.
          </span>
        </div>
      )}

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={prevWeek}
            className="p-1.5 rounded-lg border hover:bg-gray-50 transition-colors"
            style={{ borderColor }}
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-700 min-w-[200px] text-center">
            {formatWeekRange(weekStart)}
          </span>
          <button
            onClick={nextWeek}
            className="p-1.5 rounded-lg border hover:bg-gray-50 transition-colors"
            style={{ borderColor }}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={goToCurrentWeek}
            className="text-xs h-8"
            style={{ borderColor }}
          >
            This Week
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Star className="w-3 h-3" style={{ color: warningColor, fill: warningColor }} />
          <span>Peak Hour</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${primaryColor}20`, border: `1px solid ${primaryColor}40` }} />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#4A7C5912", border: "1px solid #4A7C5950" }} />
          <span>Covered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${dangerColor}12`, border: `1px solid ${dangerColor}50` }} />
          <span>Uncovered</span>
        </div>
      </div>

      {/* Week Grid */}
      <Card className="rounded-xl shadow-sm overflow-hidden" style={{ borderColor }}>
        <div className="grid grid-cols-7 divide-x" style={{ borderColor }}>
          {weekDays.map((day) => {
            const { day: dayLabel, num, isToday } = formatDayLabel(day);
            const dayShifts = shifts.filter((s) => s.date === day);
            return (
              <div key={day} className="min-h-[140px] flex flex-col">
                {/* Day Header */}
                <div
                  className="px-2 py-2 text-center border-b"
                  style={{
                    backgroundColor: isToday ? `${secondaryColor}15` : "#FAF6F0",
                    borderColor,
                  }}
                >
                  <div className="text-xs font-medium text-gray-500 uppercase">{dayLabel}</div>
                  <div
                    className={`text-base font-bold ${isToday ? "w-7 h-7 rounded-full flex items-center justify-center mx-auto text-white" : "text-gray-800"}`}
                    style={isToday ? { backgroundColor: secondaryColor } : {}}
                  >
                    {num}
                  </div>
                </div>

                {/* Shifts */}
                <div className="flex-1 p-1.5 space-y-1">
                  {dayShifts.map((shift) => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onEdit={() => setModal({ type: "edit", shift })}
                      onDelete={() => setModal({ type: "delete", shift })}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      dangerColor={dangerColor}
                      warningColor={warningColor}
                    />
                  ))}
                  <button
                    onClick={() => setModal({ type: "add", date: day })}
                    className="w-full flex items-center justify-center gap-1 py-1 rounded text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Modals */}
      {modal.type !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal({ type: "none" })} />
          <Card
            className="relative w-full max-w-lg rounded-2xl shadow-xl p-6 z-10 bg-white"
            style={{ borderColor }}
          >
            {modal.type === "add" && (
              <>
                <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>Add Shift</h2>
                <ShiftForm
                  defaultDate={modal.date}
                  onSubmit={(data) => handleCreate(modal.date, data)}
                  onCancel={() => setModal({ type: "none" })}
                  isLoading={actionLoading}
                />
              </>
            )}
            {modal.type === "edit" && (
              <>
                <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>Edit Shift</h2>
                <ShiftForm
                  initialData={modal.shift}
                  onSubmit={(data) => handleUpdate(modal.shift, data)}
                  onCancel={() => setModal({ type: "none" })}
                  isLoading={actionLoading}
                />
              </>
            )}
            {modal.type === "delete" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold" style={{ color: dangerColor }}>Delete Shift</h2>
                <p className="text-gray-600 text-sm">
                  Delete the shift for <strong>{modal.shift.barista_name}</strong> on{" "}
                  <strong>{modal.shift.date}</strong>?
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setModal({ type: "none" })} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDelete(modal.shift)}
                    disabled={actionLoading}
                    style={{ backgroundColor: dangerColor }}
                    className="text-white border-0 hover:opacity-90"
                  >
                    {actionLoading ? "Deleting..." : "Delete Shift"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
