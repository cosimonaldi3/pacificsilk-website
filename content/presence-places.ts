import type { PresenceCountryId } from "@/content/about";

/* Facts about each Presence country that don't change with the language:
   where its dot sits on the About map and the HQ photo.
   Dots sit near the visual middle of each country. */
export interface PresencePlace {
  lat: number;
  lng: number;
  /* /public path. Countries without one show a solid ink header until a photo is added. */
  hqImage?: string;
  /* CSS object-position for the photo crop. Defaults to centred. */
  hqImagePosition?: string;
}

export const presencePlaces: Record<Exclude<PresenceCountryId, "more">, PresencePlace> = {
  spain: { lat: 40.2, lng: -3.6, hqImage: "/countries/office-spain.jpg" },
  italy: { lat: 42.8, lng: 12.5, hqImage: "/countries/office-italy.jpg" },
  mexico: { lat: 23.6, lng: -102.5, hqImage: "/countries/office-mexico.jpg", hqImagePosition: "50% 8%" },
  panama: { lat: 8.5, lng: -80.0, hqImage: "/countries/office-panama.jpg" },
  peru: { lat: -9.2, lng: -75.0, hqImage: "/countries/office-peru.jpg" },
};
