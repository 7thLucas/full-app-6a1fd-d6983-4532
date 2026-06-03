import { useState, type FormEvent } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useConfigurables } from "~/modules/configurables";
import { ShiftPeriod, ShiftStatus, type BaristaShift, type CreateShiftDto } from "../api/shifts.model";

type Props = {
  initialData?: BaristaShift;
  defaultDate?: string;
  onSubmit: (data: CreateShiftDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

const PERIOD_OPTIONS = [
  { value: ShiftPeriod.Opening, label: "Opening (early morning)" },
  { value: ShiftPeriod.Morning, label: "Morning Rush (7-10am)" },
  { value: ShiftPeriod.Midday, label: "Midday (10am-2pm)" },
  { value: ShiftPeriod.Afternoon, label: "Afternoon (2-5pm)" },
  { value: ShiftPeriod.Closing, label: "Closing (evening)" },
  { value: ShiftPeriod.Full, label: "Full Day" },
];

const STATUS_OPTIONS = [
  { value: ShiftStatus.Scheduled, label: "Scheduled" },
  { value: ShiftStatus.Covered, label: "Covered" },
  { value: ShiftStatus.Uncovered, label: "Uncovered" },
  { value: ShiftStatus.Completed, label: "Completed" },
];

const ROLES = ["Barista", "Lead Barista", "Shift Supervisor", "Trainer", "Manager on Duty"];

export function ShiftForm({ initialData, defaultDate, onSubmit, onCancel, isLoading }: Props) {
  const { config } = useConfigurables();
  const primaryColor = config?.brandColor?.primary ?? "#3B1F0A";

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(initialData?.date ?? defaultDate ?? today);
  const [baristaName, setBaristaName] = useState(initialData?.barista_name ?? "");
  const [startTime, setStartTime] = useState(initialData?.start_time ?? "07:00");
  const [endTime, setEndTime] = useState(initialData?.end_time ?? "15:00");
  const [period, setPeriod] = useState(initialData?.period ?? ShiftPeriod.Morning);
  const [role, setRole] = useState(initialData?.role ?? "Barista");
  const [status, setStatus] = useState(initialData?.status ?? ShiftStatus.Scheduled);
  const [isPeakHour, setIsPeakHour] = useState(initialData?.is_peak_hour ?? false);
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!baristaName.trim()) { setError("Barista name is required."); return; }
    if (!startTime || !endTime) { setError("Start and end time are required."); return; }
    try {
      await onSubmit({
        date,
        barista_name: baristaName.trim(),
        start_time: startTime,
        end_time: endTime,
        period: period as ShiftPeriod,
        role,
        status: status as ShiftStatus,
        is_peak_hour: isPeakHour,
        notes: notes.trim(),
      });
    } catch (err: any) {
      setError(err.message ?? "An error occurred");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="shift-date">Date *</Label>
          <Input
            id="shift-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="shift-barista">Barista Name *</Label>
          <Input
            id="shift-barista"
            value={baristaName}
            onChange={(e) => setBaristaName(e.target.value)}
            placeholder="Full name"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="shift-start">Start Time *</Label>
          <Input
            id="shift-start"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="shift-end">End Time *</Label>
          <Input
            id="shift-end"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="shift-period">Period</Label>
          <select
            id="shift-period"
            value={period}
            onChange={(e) => setPeriod(e.target.value as ShiftPeriod)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="shift-role">Role</Label>
          <select
            id="shift-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="shift-status">Status</Label>
          <select
            id="shift-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ShiftStatus)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="block mb-2">Peak Hour Shift</Label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPeakHour}
              onChange={(e) => setIsPeakHour(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-600">Mark as peak hour</span>
          </label>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="shift-notes">Notes</Label>
        <Input
          id="shift-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
        />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: primaryColor }}
          className="text-white border-0 hover:opacity-90"
        >
          {isLoading ? "Saving..." : initialData ? "Update Shift" : "Add Shift"}
        </Button>
      </div>
    </form>
  );
}
