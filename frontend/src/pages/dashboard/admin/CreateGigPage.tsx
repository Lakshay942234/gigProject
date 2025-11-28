import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { AnimatedCard } from "../../../components/ui/motion-card";
import api from "../../../lib/axios";
import { Loader2, Plus } from "lucide-react";

interface CreateGigForm {
  title: string;
  description: string;
  processType: string;
  payModel: "HOURLY" | "PER_TASK" | "PER_CHAT" | "FIXED";
  payRate: number;
  currency: string;
  startDate: string;
  endDate?: string;
  requiredSkills: string; // Comma separated for input
  maxAgents: number;
  startTime: string;
  endTime: string;
  recurringDays: string[];
}

export const CreateGigPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGigForm>();

  const onSubmit = async (data: CreateGigForm) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        payRate: Number(data.payRate),
        maxAgents: Number(data.maxAgents),
        requiredSkills: data.requiredSkills.split(",").map((s) => s.trim()),
      };

      await api.post("/gigs", payload);
      navigate("/dashboard/gigs");
    } catch (error) {
      console.error("Failed to create gig:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Gig</h1>
          <p className="text-muted-foreground mt-2">
            Post a new work opportunity for candidates.
          </p>
        </div>
      </div>

      <AnimatedCard className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Gig Title</label>
              <Input
                {...register("title", { required: "Title is required" })}
                placeholder="e.g. Customer Support Specialist"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Process Type</label>
              <Input
                {...register("processType", {
                  required: "Process Type is required",
                })}
                placeholder="e.g. Voice, Chat, Data Entry"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Detailed description of the gig..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pay Model</label>
              <select
                {...register("payModel")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="HOURLY">Hourly</option>
                <option value="PER_TASK">Per Task</option>
                <option value="PER_CHAT">Per Chat</option>
                <option value="FIXED">Fixed Price</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pay Rate</label>
              <Input
                type="number"
                step="0.01"
                {...register("payRate", {
                  required: "Pay Rate is required",
                  min: 0,
                })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Input
                {...register("currency", { required: true })}
                defaultValue="INR"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Agents</label>
              <Input
                type="number"
                {...register("maxAgents", { required: true, min: 1 })}
                defaultValue="10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                {...register("startDate", {
                  required: "Start Date is required",
                })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date (Optional)</label>
              <Input type="date" {...register("endDate")} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input type="time" {...register("startTime")} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input type="time" {...register("endTime")} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium block mb-2">
                Recurring Days (Weekend)
              </label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="SATURDAY"
                    {...register("recurringDays")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>Saturday</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="SUNDAY"
                    {...register("recurringDays")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>Sunday</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Required Skills (Comma separated)
              </label>
              <Input
                {...register("requiredSkills", {
                  required: "Skills are required",
                })}
                placeholder="e.g. English, Typing, Excel"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Gig
                </>
              )}
            </Button>
          </div>
        </form>
      </AnimatedCard>
    </div>
  );
};
