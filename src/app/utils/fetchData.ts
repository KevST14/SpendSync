import axios from "axios";

export async function fetchData<T = unknown>(url: string): Promise<T | null> {
  try {
    const response = await axios.get<T>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
