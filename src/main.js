import './main.css';
import { createClient } from '@supabase/supabase-js';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Supabase Initialization
const supabaseUrl = 'https://ynaebzwplirfhvoxrvnz.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYWViendwbGlyZmh2b3hydm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMDg4NTAsImV4cCI6MjA0OTg4NDg1MH0.Ac6HePbKTdeCVDWAe8KIZOO4iXzIuLODWKRzyhqmfpA';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true },
});


// Main Script
document.addEventListener("DOMContentLoaded", async () => {
  
  // DOM Elements
  const scrollContainer = document.getElementById("scrollContainer");
  const addCardBtn = document.getElementById("addCardBtn");
  const hamburgerButton = document.getElementById("hamburgerButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const exitButton = document.getElementById("exit");
  const scrollLeftBtn = document.getElementById("scrollLeftBtn");
  const scrollRightBtn = document.getElementById("scrollRightBtn");
  let workoutDaysElement = document.getElementById('workout-days');
  const workoutBarChartCanvas = document.getElementById('workoutBarChartCanvas');
  const sleepChartCanvas = document.getElementById('sleepChartCanvas');
  const loginBtn = document.getElementById("loginBtn");
  const loginPopup = document.getElementById("loginPopup");
  const closePopup = document.getElementById("closePopup");
  const loginForm = document.getElementById("loginForm");
  const discordLoginBtn = document.getElementById("discordLoginBtn");
  const logoutButton = document.getElementById('logoutBtn');
  const userWelcome = document.getElementById('userWelcome');
  
    //Ensure supabase restores session after the redirection
    async function checkSession() {

      //Force refresh the session
      await supabase.auth.refreshSession();

      const { data: session, error } = await supabase.auth.getSession();


      //debug logs
      console.log("Session data:", session);
      if (session) {
        console.log("Session user:", session.user);
      }
  
      if (error) {
        console.error("Error fetching session: ", error.message);
        return;
      }
  
      if (session?.user) {
        const userData = session.user;
  
        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(userData));
        console.log("User stored in local storage:", localStorage.getItem('user'));
  
        // Update UI
        discordLoginBtn?.classList.add('hidden');
        logoutButton?.classList.remove('hidden');
        userWelcome.textContent = `Welcome, ${userData.user_metadata?.name || 'User'}!`;
      } else {
        console.log("No active session found");
        // Update UI for guests
        discordLoginBtn?.classList.remove('hidden');
        logoutButton?.classList.add('hidden');
        userWelcome.textContent = 'Welcome, Guest!';
      }
    }


    //Login with disc
    discordLoginBtn?.addEventListener('click', async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'discord',
          options: {
            redirectTo: `https://loquacious-bonbon-ac9300.netlify.app/index.html`, // Replace with your app's URL
          },
        });
  
        if (error) {
          console.error("Error during Discord login:", error.message);
          alert("Login failed. Please try again.");
        }
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    });
  

    //Logout functionality
    logoutButton?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      console.log("User logged out and local storage cleared");
      window.location.reload();
    });
  
    // run all functions on page load
    await checkSession();
  });
  
  
  //Show the login popup when the login button is clicked
  loginBtn.addEventListener("click", () => {
    loginPopup.classList.remove("hidden");
    });

  //close popup when button is clicked
  closePopup.addEventListener("click", () => {
    loginPopup.classList.add("hidden");
  });

  // Add Card Button Logic
  if (addCardBtn && scrollContainer) {
    addCardBtn.addEventListener("click", () => {
      const newCard = document.createElement("div");
      newCard.className = "bg-darkBackground hover:bg-gray-800 flex flex-col justify-between lg:h-60 px-4 py-2 rounded-lg text-white font-thin lg:flex-1";
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

  // Workout Chart
  if (workoutBarChartCanvas) {
    const ctx = workoutBarChartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Calories Intake', 'Calories Burned', 'Activity Time'],
        datasets: [{
          label: 'Workout Metrics',
          data: [800, 850, 400],
          backgroundColor: ['#23262C', '#9E2835', '#000000'],
          borderRadius: 5,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255, 255, 255, 0.2)' },
          },
          y: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255, 255, 255, 0.2)' },
          },
        },
      },
    });
  }

  // Example Data: Days worked out this year
  const workedOutDays = ["2024-01-01", "2024-01-03", "2024-01-07", "2024-02-14", "2024-03-21"];
  if (workoutDaysElement) {
    workoutDaysElement.textContent = `${workedOutDays.length} Days`;
  }

  // Sleep Chart
  if (sleepChartCanvas) {
    const sleepCtx = sleepChartCanvas.getContext('2d');
    new Chart(sleepCtx, {
      type: 'bar',
      data: {
        labels: ['Actual', 'Goal'],
        datasets: [{
          label: 'Sleep Time',
          data: [6, 8],
          backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Hours' },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  };
