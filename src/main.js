import "./main.css";
import { createClient } from "@supabase/supabase-js";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

(() => {
  // Supabase Initialization
  const supabaseUrl = "https://ynaebzwplirfhvoxrvnz.supabase.co";
  const supabaseKey =
    process.env.SUPABASE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYWViendwbGlyZmh2b3hydm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMDg4NTAsImV4cCI6MjA0OTg4NDg1MH0.Ac6HePbKTdeCVDWAe8KIZOO4iXzIuLODWKRzyhqmfpA";

  if (!process.env.SUPABASE_KEY) {
    console.warn("WARNING: Using hardcoded Supabase key. Ensure to use environment variables in production.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: true },
  });

  // Mock user for local development
  let mockUser;
  async function fetchMockUser() {
    try {
      mockUser = { id: "123", user_metadata: { name: "Test User" } };
      console.log("Mock user fetched:", mockUser);
    } catch (error) {
      console.error("Error fetching mock user:", error);
      mockUser = { id: "guest", user_metadata: { name: "Guest" } }; // Fallback to guest user
    }
  }

  // Function to update UI based on user session
  function updateUI(user) {
    if (user) {
      console.log("User is logged in:", user);
      document.getElementById("loginButton")?.classList.add("hidden");
      document.getElementById("logoutButton")?.classList.remove("hidden");
      document.getElementById("userWelcome")?.classList.remove("hidden");
      document.getElementById("basicHello")?.classList.add("hidden");
    } else {
      console.log("No user logged in");
      document.getElementById("loginButton")?.classList.remove("hidden");
      document.getElementById("logoutButton")?.classList.add("hidden");
      document.getElementById("userWelcome")?.classList.add("hidden");
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOMContentLoaded event fired.");
    await fetchMockUser();
    updateUI(mockUser);

    // Element selections
    const elements = {
      scrollContainer: document.getElementById("scrollContainer"),
      addCardBtn: document.getElementById("addCardBtn"),
      hamburgerButton: document.getElementById("hamburgerButton"),
      mobileMenu: document.getElementById("mobileMenu"),
      exitButton: document.getElementById("exit"),
      scrollLeftBtn: document.getElementById("scrollLeftBtn"),
      scrollRightBtn: document.getElementById("scrollRightBtn"),
      workoutDaysElement: document.getElementById("workout-days"),
      workoutBarChartCanvas: document.getElementById("workoutBarChartCanvas"),
      sleepChartCanvas: document.getElementById("sleepChartCanvas"),
      loginButton: document.getElementById("loginButton"),
      loginPopup: document.getElementById("loginPopup"),
      closePopup: document.getElementById("closePopup"),
      discordLoginButton: document.getElementById("discordLoginButton"),
      logoutButton: document.getElementById("logoutBtn"),
      userWelcome: document.getElementById("userWelcome"),
      basicHello: document.getElementById("basicHello"),
    };

    // Login and logout functionality
    elements.discordLoginButton?.addEventListener("click", async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "discord",
          options: { redirectTo: window.location.href },
        });
        if (error) throw error;
        console.log("User logged in successfully");
        await updateUI(await supabase.auth.getSession());
      } catch (err) {
        console.error("Error during login:", err.message);
        alert("Login failed. Please try again.");
      }
    });

    elements.logoutButton?.addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.reload();
    });

    // Popup handling
    elements.loginButton?.addEventListener("click", () => {
      elements.loginPopup?.classList.remove("hidden");
    });

    elements.closePopup?.addEventListener("click", () => {
      elements.loginPopup?.classList.add("hidden");
    });

    // Charts
    if (elements.workoutBarChartCanvas) {
      const ctx = elements.workoutBarChartCanvas.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Calories Intake", "Calories Burned", "Activity Time"],
          datasets: [
            { label: "Workout Metrics", data: [800, 850, 400], backgroundColor: ["#23262C", "#9E2835", "#000000"] },
          ],
        },
        options: { responsive: true, plugins: { legend: { display: false } } },
      });
    }

    if (elements.sleepChartCanvas) {
      const sleepCtx = elements.sleepChartCanvas.getContext("2d");
      new Chart(sleepCtx, {
        type: "bar",
        data: {
          labels: ["Actual", "Goal"],
          datasets: [{ label: "Sleep Time", data: [6, 8], backgroundColor: ["rgba(54,162,235,0.2)", "rgba(255,206,86,0.2)"] }],
        },
        options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } },
      });
    }
  });
})();
