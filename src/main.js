import "./main.css";
import { createClient } from "@supabase/supabase-js";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);


// Main Script: Ensure everything is loaded and then check session
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded event fired.");

  // Call checkSession to update UI based on user login status
  await checkSession();

  // DOM Elements for various interactions
  const scrollContainer = document.getElementById("scrollContainer");
  const addCardBtn = document.getElementById("addCardBtn");
  const hamburgerButton = document.getElementById("hamburgerButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const exitButton = document.getElementById("exit");
  const scrollLeftBtn = document.getElementById("scrollLeftBtn");
  const scrollRightBtn = document.getElementById("scrollRightBtn");
  const workoutDaysElement = document.getElementById("workout-days");
  const workoutBarChartCanvas = document.getElementById("workoutBarChartCanvas");
  const sleepChartCanvas = document.getElementById("sleepChartCanvas");
  const loginButton = document.getElementById("loginButton");
  const loginPopup = document.getElementById("loginPopup");
  const closePopup = document.getElementById("closePopup");
  const discordLoginButton = document.getElementById("discordLoginButton");
  const logoutButton = document.getElementById("logoutBtn");
  const userWelcome = document.getElementById("userWelcome");
  const basicHello = document.getElementById("basicHello");



  // Supabase Initialization
const supabaseUrl = "https://ynaebzwplirfhvoxrvnz.supabase.co";
const supabaseKey =
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYWViendwbGlyZmh2b3hydm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMDg4NTAsImV4cCI6MjA0OTg4NDg1MH0.Ac6HePbKTdeCVDWAe8KIZOO4iXzIuLODWKRzyhqmfpA";
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true },
});


  // Check if discordLoginButton exists in DOM
  if (!discordLoginButton) {
    console.error("discordLoginButton not found in the DOM!");
    return;
  }

  // Mock Supabase user object for local testing
  const mockUser = {
    id: "123",
    user_metadata: {
      name: "Test User",
    },
  };

  // Function to check user session and update the UI
  async function checkSession() {
    console.log("Checking session...");

    // Check if running locally and use mock user
    const isLocal = window.location.hostname === "localhost"; // True if running locally
    const user = isLocal ? mockUser : (await supabase.auth.getSession())?.data?.user; // Refresh session to get the latest user data

    // Update the UI based on user session
    updateUI(user);
  }

  // Function to update the UI based on user session
  function updateUI(user) {
    if (user) {
      console.log("User is logged in:", user);
      loginButton?.classList.add("hidden");
      logoutButton?.classList.remove("hidden");
      userWelcome?.classList.remove("hidden");
      userWelcome.textContent = `Welcome, ${user.user_metadata?.name || "User"}!`;
      basicHello?.classList.add("hidden");
    } else {
      console.log("No user logged in");
      loginButton?.classList.remove("hidden");
      logoutButton?.classList.add("hidden");
      userWelcome?.classList.add("hidden");
    }
  }

  // Login with Discord
  discordLoginButton?.addEventListener("click", async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: window.location.href, // redirect back to current page after login
        },
      });

      if (error) {
        console.error("Error during Discord login:", error.message);
        alert("Login failed. Please try again.");
      } else {
        console.log("User logged in successfully");
        await checkSession(); // After login, check session again to update UI
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  });

  // Logout functionality
  logoutButton?.addEventListener("click", async () => {
    console.log("Logout button clicked");
    await supabase.auth.signOut(); // Clear Supabase session
    window.location.reload(); // Reload the page to update UI
  });

  // Show login popup when login button is clicked
  loginButton?.addEventListener("click", () => {
    console.log("Main login button is clicked");
    loginPopup.classList.remove("hidden");
  });

  // Close popup when close button is clicked
  closePopup?.addEventListener("click", () => {
    console.log("Close button is clicked");
    loginPopup.classList.add("hidden");
  });

  // Charts (Workout Chart)
  if (workoutBarChartCanvas) {
    const ctx = workoutBarChartCanvas.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Calories Intake", "Calories Burned", "Activity Time"],
        datasets: [
          {
            label: "Workout Metrics",
            data: [800, 850, 400],
            backgroundColor: ["#23262C", "#9E2835", "#000000"],
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: "white" },
            grid: { color: "rgba(255, 255, 255, 0.2)" },
          },
          y: {
            ticks: { color: "white" },
            grid: { color: "rgba(255, 255, 255, 0.2)" },
          },
        },
      },
    });
  }

  // Workout Days Example Data
  const workedOutDays = [
    "2024-01-01",
    "2024-01-03",
    "2024-01-07",
    "2024-02-14",
    "2024-03-21",
  ];
  if (workoutDaysElement) {
    workoutDaysElement.textContent = `${workedOutDays.length} Days`;
  }

  // Sleep Chart
  if (sleepChartCanvas) {
    const sleepCtx = sleepChartCanvas.getContext("2d");
    new Chart(sleepCtx, {
      type: "bar",
      data: {
        labels: ["Actual", "Goal"],
        datasets: [
          {
            label: "Sleep Time",
            data: [6, 8],
            backgroundColor: [
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Hours" },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  // Hamburger Menu Toggle
  function toggleMenu() {
    if (mobileMenu) mobileMenu.classList.toggle("hidden");
  }
  if (hamburgerButton) {
    hamburgerButton.addEventListener("click", toggleMenu);
  }
  if (exitButton) {
    exitButton.addEventListener("click", toggleMenu);
  }

  // Scroll Buttons Logic
  if (scrollContainer) {
    scrollLeftBtn?.addEventListener("click", () => {
      scrollContainer.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    });

    scrollRightBtn?.addEventListener("click", () => {
      scrollContainer.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    });
  }

  // Add Card Button Logic
  if (addCardBtn && scrollContainer) {
    addCardBtn.addEventListener("click", () => {
      const newCard = document.createElement("div");
      newCard.className =
        "bg-darkBackground hover:bg-gray-800 flex flex-col justify-between lg:h-60 px-4 py-2 rounded-lg text-white font-thin lg:flex-1";
      newCard.innerHTML = `
          <div class="flex justify-between">
            <div><i class="fa-solid fa-person-running"></i></div>
            <i class="fa-solid fa-chevron-up"></i>
          </div>
          <div class="flex justify-between gap-4">
            <p class="font-thin">New Card</p>
            <p class="font-bold">Custom Data</p>
          </div>
        `;
      scrollContainer.appendChild(newCard);
      scrollContainer.scrollBy({
        left: scrollContainer.scrollWidth,
        behavior: "smooth",
      });
    });
  }
});
