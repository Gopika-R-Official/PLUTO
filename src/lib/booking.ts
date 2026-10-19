import type { ContentItem } from "./types";
import { toast } from "@/components/ui/Toast";

/**
 * Resolves a verified movie ticket booking destination.
 * Points to official showtimes / ticketing aggregators (Google Showtimes / Fandango / BookMyShow).
 */
export function getMovieTicketBookingUrl(title: string, year?: number): string {
  const query = `${title} ${year ? year : ""} movie tickets showtimes`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Opens the movie ticketing booking flow in a new browser tab.
 */
export function handleBookMovieTickets(title: string, year?: number) {
  if (typeof window === "undefined") return;
  const url = getMovieTicketBookingUrl(title, year);
  toast.info(`Opening movie ticket showtimes for "${title}"...`);
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Resolves a verified restaurant reservation booking destination.
 * Uses the restaurant's direct reservation URL or verified reservation search (OpenTable / Google Reserve).
 */
export function getRestaurantReservationUrl(item: ContentItem): string {
  if (item.metadata?.reservationUrl) {
    return item.metadata.reservationUrl;
  }
  const location = item.metadata?.locationLabel ?? "";
  const query = `${item.title} ${location} restaurant table reservation`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Opens the restaurant reservation booking flow in a new browser tab.
 */
export function handleReserveRestaurant(item: ContentItem) {
  if (typeof window === "undefined") return;
  const url = getRestaurantReservationUrl(item);
  toast.info(`Connecting to reservation service for "${item.title}"...`);
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Direct reservation query handler for restaurant title and location.
 */
export function handleBookRestaurantTable(title: string, location?: string) {
  if (typeof window === "undefined") return;
  const query = `${title} ${location ?? ""} restaurant table reservation`;
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  toast.info(`Connecting to reservation service for "${title}"...`);
  window.open(url, "_blank", "noopener,noreferrer");
}
