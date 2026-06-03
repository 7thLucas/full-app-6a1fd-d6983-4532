import { createLogger } from "~/lib/logger";
import { BaristaShiftModel, ShiftPeriod, ShiftStatus } from "./shifts.model";

const logger = createLogger("ShiftsSeed");

function getMonday(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(monday.getDate() + diff);
  return monday;
}

export async function seedBaristaShifts(): Promise<void> {
  try {
    const count = await BaristaShiftModel.countDocuments();
    if (count > 0) {
      logger.info("Barista shifts already seeded, skipping.");
      return;
    }

    const monday = getMonday(new Date());
    const baristas = ["Alex Chen", "Maria Santos", "Jordan Kim", "Sam Patel", "Riley Thompson"];

    const shifts = [];

    for (let day = 0; day < 7; day++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + day);
      const dateStr = d.toISOString().split("T")[0];
      const isWeekend = day === 5 || day === 6;

      if (!isWeekend) {
        // Weekday: 3 shifts
        shifts.push({
          date: dateStr,
          barista_name: baristas[day % baristas.length],
          start_time: "06:30",
          end_time: "14:30",
          period: ShiftPeriod.Opening,
          role: "Lead Barista",
          status: ShiftStatus.Scheduled,
          is_peak_hour: true,
          notes: "Opening + morning rush",
        });
        shifts.push({
          date: dateStr,
          barista_name: baristas[(day + 1) % baristas.length],
          start_time: "07:00",
          end_time: "15:00",
          period: ShiftPeriod.Morning,
          role: "Barista",
          status: ShiftStatus.Scheduled,
          is_peak_hour: true,
          notes: "",
        });
        shifts.push({
          date: dateStr,
          barista_name: baristas[(day + 2) % baristas.length],
          start_time: "12:00",
          end_time: "20:00",
          period: ShiftPeriod.Afternoon,
          role: "Barista",
          status: day === 2 ? ShiftStatus.Uncovered : ShiftStatus.Scheduled, // Wednesday uncovered for demo
          is_peak_hour: false,
          notes: day === 2 ? "Need coverage" : "",
        });
      } else {
        // Weekend: 2 shifts
        shifts.push({
          date: dateStr,
          barista_name: baristas[day % baristas.length],
          start_time: "08:00",
          end_time: "16:00",
          period: ShiftPeriod.Morning,
          role: "Lead Barista",
          status: ShiftStatus.Scheduled,
          is_peak_hour: true,
          notes: "",
        });
        shifts.push({
          date: dateStr,
          barista_name: baristas[(day + 3) % baristas.length],
          start_time: "11:00",
          end_time: "19:00",
          period: ShiftPeriod.Afternoon,
          role: "Barista",
          status: ShiftStatus.Scheduled,
          is_peak_hour: false,
          notes: "",
        });
      }
    }

    await BaristaShiftModel.insertMany(shifts);
    logger.info(`Seeded ${shifts.length} barista shifts for current week.`);
  } catch (error) {
    logger.error("Failed to seed barista shifts:", error);
  }
}
