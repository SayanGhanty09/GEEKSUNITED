import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ksfjxpsucfzvixedfptx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZmp4cHN1Y2Z6dml4ZWRmcHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNzAwNjEsImV4cCI6MjEwODk0NjA2MX0.bQV99a2MYjFCSneibDkeB9-wHweh6Wrk9s3kgrks6gA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ============================================================== */
/* AUTHORIZED COORDINATOR & MASTER ADMIN                          */
/* ============================================================== */
export const MASTER_ADMIN_EMAIL = "ghantysayan8@gmail.com";

export function isMasterAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
}

export function isAuthorizedCoordinator(
  email?: string | null,
  approvedEmails: string[] = []
): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  if (clean === MASTER_ADMIN_EMAIL.toLowerCase()) return true;
  return approvedEmails.some((e) => e.trim().toLowerCase() === clean);
}

/* ============================================================== */
/* DATA MODELS                                                    */
/* ============================================================== */
export interface DbEvent {
  id: string;
  title: string;
  category: "ongoing" | "upcoming" | "previous";
  date: string;
  venue: string;
  perk?: string;
  desc: string;
  photo?: string;
  tag?: string;
  created_at?: string;
}

export interface DbCoordinator {
  id: string;
  type: "teacher" | "student";
  name: string;
  role: string;
  dept_or_domain: string;
  email: string;
  linkedin?: string;
  social?: string;
  avatar?: string;
  bio?: string;
  display_order?: number;
  created_at?: string;
}

export interface DbJoinApplication {
  id?: string;
  full_name: string;
  college_email: string;
  year_of_study: string;
  primary_domain: string;
  skills?: string;
  portfolio_link?: string;
  status?: string;
  created_at?: string;
}

export interface DbContactMessage {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at?: string;
}

export interface DbCoordinatorRequest {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role_requested: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

/* ============================================================== */
/* AUTHENTICATION HELPERS (SUPABASE EMAIL/PASSWORD AUTH)          */
/* ============================================================== */

/**
 * Sign in using manual Email & Password via Supabase Auth
 */
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { data, error };
  } catch (err: any) {
    console.warn("Supabase email sign-in exception:", err?.message);
    return { data: null, error: err };
  }
}

/**
 * Sign up a new account using Email & Password via Supabase Auth
 */
export async function signUpWithEmailPassword(
  email: string,
  password: string
): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    return { data, error };
  } catch (err: any) {
    console.warn("Supabase email sign-up exception:", err?.message);
    return { data: null, error: err };
  }
}

/**
 * Sign out current Supabase auth session
 */
export async function signOutUser(): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

/* ============================================================== */
/* COORDINATOR DATABASE OPERATIONS                                */
/* ============================================================== */

/**
 * Fetch all coordinators from Supabase 'coordinators' table.
 */
export async function getCoordinatorsFromDb(): Promise<{ data: DbCoordinator[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("coordinators")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("Supabase getCoordinators warning:", error.message);
      return { data: null, error };
    }
    return { data: data as DbCoordinator[], error: null };
  } catch (err: any) {
    console.warn("Supabase coordinators fetch exception:", err?.message);
    return { data: null, error: err };
  }
}

/**
 * Upsert (Insert or Update) a coordinator in Supabase 'coordinators' table.
 */
export async function upsertCoordinatorToDb(coord: DbCoordinator): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from("coordinators")
      .upsert([
        {
          id: coord.id,
          type: coord.type,
          name: coord.name,
          role: coord.role,
          dept_or_domain: coord.dept_or_domain,
          email: coord.email,
          linkedin: coord.linkedin || "",
          social: coord.social || "",
          avatar: coord.avatar || "",
          bio: coord.bio || "",
          display_order: coord.display_order ?? 0,
        },
      ], { onConflict: "id" })
      .select();

    return { data, error };
  } catch (err: any) {
    console.warn("Supabase upsertCoordinator exception:", err?.message);
    return { data: null, error: err };
  }
}

/**
 * Delete a coordinator from Supabase 'coordinators' table.
 */
export async function deleteCoordinatorFromDb(id: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from("coordinators")
      .delete()
      .eq("id", id);

    return { error };
  } catch (err: any) {
    console.warn("Supabase deleteCoordinator exception:", err?.message);
    return { error: err };
  }
}

/* ============================================================== */
/* EVENT DATABASE OPERATIONS                                      */
/* ============================================================== */

export async function getEventsFromDb(): Promise<{ data: DbEvent[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase getEvents warning:", error.message);
      return { data: null, error };
    }
    return { data: data as DbEvent[], error: null };
  } catch (err: any) {
    console.warn("Supabase fetch exception:", err?.message);
    return { data: null, error: err };
  }
}

export async function insertEventToDb(event: DbEvent): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from("events")
      .upsert([
        {
          id: event.id,
          title: event.title,
          category: event.category,
          date: event.date,
          venue: event.venue,
          perk: event.perk,
          desc: event.desc,
          photo: event.photo,
          tag: event.tag,
        },
      ], { onConflict: "id" })
      .select();

    return { data, error };
  } catch (err: any) {
    console.warn("Supabase insertEvent exception:", err?.message);
    return { data: null, error: err };
  }
}

export async function deleteEventFromDb(id: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    return { error };
  } catch (err: any) {
    console.warn("Supabase deleteEvent exception:", err?.message);
    return { error: err };
  }
}

/* ============================================================== */
/* JOIN APPLICATIONS & CONTACT OPERATIONS                         */
/* ============================================================== */

export async function insertJoinApplicationToDb(app: DbJoinApplication): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from("join_applications")
      .insert([
        {
          full_name: app.full_name,
          college_email: app.college_email,
          year_of_study: app.year_of_study,
          primary_domain: app.primary_domain,
          skills: app.skills,
          portfolio_link: app.portfolio_link,
        },
      ])
      .select();

    return { data, error };
  } catch (err: any) {
    console.warn("Supabase insertJoinApplication exception:", err?.message);
    return { data: null, error: err };
  }
}

export async function getJoinApplicationsFromDb(): Promise<{ data: DbJoinApplication[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("join_applications")
      .select("*")
      .order("created_at", { ascending: false });

    return { data: data as DbJoinApplication[], error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateJoinApplicationStatusInDb(id: string, status: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from("join_applications")
      .update({ status })
      .eq("id", id);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

export async function deleteJoinApplicationFromDb(id: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from("join_applications")
      .delete()
      .eq("id", id);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

export async function insertContactMessageToDb(msg: DbContactMessage): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name: msg.name,
          email: msg.email,
          subject: msg.subject,
          message: msg.message,
        },
      ])
      .select();

    return { data, error };
  } catch (err: any) {
    console.warn("Supabase insertContactMessage exception:", err?.message);
    return { data: null, error: err };
  }
}

/* ============================================================== */
/* COORDINATOR ACCESS REQUESTS & APPROVAL WORKFLOW                */
/* ============================================================== */

/**
 * Submit a coordinator access request.
 * Automatically records into 'coordinator_requests' with status 'pending'
 * and records an alert notification into 'contact_messages' for ghantysayan8@gmail.com
 */
export async function submitCoordinatorRequest(req: {
  name: string;
  email: string;
  phone?: string;
  role_requested: string;
  reason: string;
}): Promise<{ data: any; error: any }> {
  try {
    const cleanEmail = req.email.trim().toLowerCase();

    // 1. Insert or update in coordinator_requests table
    const { data, error } = await supabase
      .from("coordinator_requests")
      .upsert(
        [
          {
            name: req.name.trim(),
            email: cleanEmail,
            phone: req.phone || "",
            role_requested: req.role_requested,
            reason: req.reason,
            status: "pending",
          },
        ],
        { onConflict: "email" }
      )
      .select();

    if (error) {
      console.warn("Supabase submitCoordinatorRequest warning:", error.message);
      return { data: null, error };
    }

    // 2. Also dispatch an automated audit alert message to contact_messages directed to Master Admin
    try {
      await supabase.from("contact_messages").insert([
        {
          name: req.name.trim(),
          email: cleanEmail,
          subject: `[COORDINATOR ACCESS REQUEST] ${req.name} (${cleanEmail})`,
          message: `NEW COORDINATOR ACCESS REQUEST FOR ADMIN REVIEW:
Requester Name: ${req.name}
Requester Email: ${cleanEmail}
Role Requested: ${req.role_requested}
Reason / Credentials: ${req.reason}

Note: Access is blocked until Master Admin (${MASTER_ADMIN_EMAIL}) explicitly grants approval in the Admin Requests Portal.`,
        },
      ]);
    } catch (e) {
      console.warn("Could not write audit message to contact_messages:", e);
    }

    return { data, error: null };
  } catch (err: any) {
    console.warn("Supabase submitCoordinatorRequest exception:", err?.message);
    return { data: null, error: err };
  }
}

/**
 * Fetch all coordinator requests for admin review
 */
export async function getCoordinatorRequestsFromDb(): Promise<{
  data: DbCoordinatorRequest[] | null;
  error: any;
}> {
  try {
    const { data, error } = await supabase
      .from("coordinator_requests")
      .select("*")
      .order("created_at", { ascending: false });

    return { data: data as DbCoordinatorRequest[], error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Update request status ('approved' or 'rejected') by admin
 */
export async function updateCoordinatorRequestStatus(
  id: string,
  status: "approved" | "rejected",
  reviewedBy: string = MASTER_ADMIN_EMAIL
): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from("coordinator_requests")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewedBy,
      })
      .eq("id", id);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Delete a coordinator request record
 */
export async function deleteCoordinatorRequestFromDb(id: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from("coordinator_requests")
      .delete()
      .eq("id", id);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Fetch the list of approved coordinator email addresses
 */
export async function getApprovedCoordinatorEmailsFromDb(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("coordinator_requests")
      .select("email")
      .eq("status", "approved");

    if (error || !data) {
      return [MASTER_ADMIN_EMAIL.toLowerCase()];
    }

    const approved = data.map((d: { email: string }) => d.email.trim().toLowerCase());
    if (!approved.includes(MASTER_ADMIN_EMAIL.toLowerCase())) {
      approved.push(MASTER_ADMIN_EMAIL.toLowerCase());
    }
    return approved;
  } catch (err) {
    return [MASTER_ADMIN_EMAIL.toLowerCase()];
  }
}

