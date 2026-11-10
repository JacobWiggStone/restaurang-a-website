import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,

  // Restaurangen ska se publicerade ändringar direkt.
  // Vi använder därför Sanitys API direkt i stället för CDN-cachen.
  useCdn: false,
});