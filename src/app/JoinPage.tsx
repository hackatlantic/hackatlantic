import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { supabase } from "../lib/supabase";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";

interface JoinFormValues {
  name: string;
  email: string;
  whyHackAtlantic: string;
  whatYouBring: string;
  resume: FileList;
}

export default function JoinPage() {
  const form = useForm<JoinFormValues>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: JoinFormValues) => {
    try {
      const file = data.resume[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("org-resumes")
        .upload(fileName, file);
      if (uploadError) throw new Error(`Failed to upload resume: ${uploadError.message}`);

      const {
        data: { publicUrl },
      } = supabase.storage.from("org-resumes").getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("org_applications")
        .insert({
          name: data.name,
          email: data.email,
          resume_url: publicUrl,
          why_hack_atlantic: data.whyHackAtlantic,
          what_you_bring: data.whatYouBring,
        });
      if (insertError) throw new Error("Failed to submit application.");

      toast.success("Application submitted! We'll be in touch.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="bottom-center" richColors />
      <div className="max-w-lg mx-auto py-16 px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Join Hack Atlantic</h1>
          <p className="mt-2 text-gray-500">
            Apply to join the organizing team. We'll review your application and be in touch.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jane@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-900">
                Resume <span className="text-gray-400">(PDF or DOCX)</span>
              </label>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                {...register("resume", {
                  required: "Please attach your resume",
                  validate: {
                    fileType: (fileList: FileList) => {
                      const file = fileList?.[0];
                      if (!file) return "Please attach your resume";
                      const allowed = [
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      ];
                      return (
                        allowed.includes(file.type) ||
                        "Resume must be a PDF or DOCX file"
                      );
                    },
                  },
                })}
              />
              {errors.resume && (
                <p className="text-destructive text-sm">{errors.resume.message}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="whyHackAtlantic"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why Hack Atlantic?</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Tell us why you want to be part of Hack Atlantic..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatYouBring"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What will you bring to Hack Atlantic?</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Describe your skills, experience, and what you'll contribute..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white hover:bg-gray-700"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
