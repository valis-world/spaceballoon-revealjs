// This file initializes the reveal.js presentation and contains custom javascript for animations and slide-specific interactions.
let animationState = {
    timeoutId: null,
    animationFrameId: null
};

// Animate participant count
let animatingFragments = false;

Reveal.on('slidechanged', function(event) {
    if (animationState.timeoutId) {
        clearTimeout(animationState.timeoutId);
    }
    if (animationState.animationFrameId) {
        cancelAnimationFrame(animationState.animationFrameId);
    }
    animationState.timeoutId = null;
    animationState.animationFrameId = null;

    const el = document.getElementById('participant-count');

    if (event.indexh === 3 && event.indexv === 0) {
        const target = 10000;
        const duration = 5000;
        const delay = 500;

        let startTime = null;

        function animateCount(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }
            const progress = timestamp - startTime;
            const t = Math.min(progress / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.floor(eased * target);

            el.textContent = current.toLocaleString();

            if (progress < duration) {
                animationState.animationFrameId = requestAnimationFrame(animateCount);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        el.textContent = '0';
        animationState.timeoutId = setTimeout(() => {
            requestAnimationFrame(animateCount);
        }, delay);

    } else if (el) {
        if (event.previousSlide && 
            event.previousSlide.querySelector('#participant-count')) {
            setTimeout(() => {
                const currentValue = parseInt(el.textContent.replace(/,/g, ''));
                let startTime = null;
                
                function animateDown(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const duration = 1000;
                    const t = Math.min(progress / duration, 1);
                    const eased = Math.pow(1 - t, 2);
                    const current = Math.floor(eased * currentValue);
                    
                    el.textContent = current.toLocaleString();
                    
                    if (progress < duration) {
                        requestAnimationFrame(animateDown);
                    } else {
                        el.textContent = '0';
                    }
                }
                
                requestAnimationFrame(animateDown);
            }, 300);
        } else {
            el.textContent = '0';
        }
    }

    // Only run on "Competition Rounds" slide
    if (event.currentSlide.querySelector('h2') &&
        event.currentSlide.querySelector('h2').textContent.includes('Competition Rounds')) {
        let fragmentIndex = 0;
        let fragments = event.currentSlide.querySelectorAll('.fragment');
        animatingFragments = true;

        function showNextFragment() {
            if (fragmentIndex < fragments.length) {
                Reveal.nextFragment();
                fragmentIndex++;
                setTimeout(showNextFragment, 2000); // 2 seconds between fragments
            } else {
                animatingFragments = false;
            }
        }
        setTimeout(showNextFragment, 2000);
    } else {
        animatingFragments = false;
    }
});

// Prevent navigation while animating fragments
document.addEventListener('keydown', function(e) {
    if (animatingFragments && (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        e.stopPropagation();
    }
});
document.addEventListener('click', function(e) {
    if (animatingFragments) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

// Prticipant chart
let participantsChart;

Reveal.on('slidechanged', event => {
  const canvas = event.currentSlide.querySelector('#participantsChart');
  if (!canvas) return;

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  const data = [
    {x: 1966, y: 244},
    {x: 1971, y: 1402},
    {x: 1980, y: 1565},
    {x: 1990, y: 3207},
    {x: 2000, y: 6980},
    {x: 2010, y: 10196},
    {x: 2020, y: 11768},
    {x: 2025, y: 10350}
  ];

  const totalDuration = 2200; // total animation time
  const pointDelay = totalDuration / data.length;

  canvas.chart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      datasets: [{
        label: 'Participants',
        data: data,
        borderColor: "#0f47beff",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 0, // start hidden
        pointHoverRadius: 5,
        pointBackgroundColor: "#0f47beff",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        borderDash: [1000, 1000] // hides line initially
      }]
    },
    options: {
      responsive: true,
      animation: {
        borderDashOffset: {
          duration: totalDuration,
          easing: 'easeInOutCubic',
          from: 1000,
          to: 0
        },
        onProgress: (animation) => {
          const chart = animation.chart;
          const meta = chart.getDatasetMeta(0);
          const progress = animation.currentStep / animation.numSteps;

          // show points after the line has reached them
          meta.data.forEach((point, index) => {
            if (progress > index / (meta.data.length - 1)) {
              point.options.radius = 3;
            } else {
              point.options.radius = 0;
            }
          });

          chart.draw();
        }
      },
      plugins: {
        title: {
          display: true,
          text: "Jugend forscht Participants Over Time",
          font: { size: 20, weight: "bold" },
          color: "#111"
        },
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          displayColors: false,
          titleFont: { weight: "bold" },
          bodyFont: { size: 13 }
        }
      },
      scales: {
        x: {
          type: 'category',            // treat years as categories
          labels: [1966, 1971, 1980, 1990, 2000, 2010, 2020, 2025],
          title: { display: true, text: "Year" },
          grid: { color: "rgba(0,0,0,0.05)" },
          ticks: { color: "#333" }
        },
        y: {
          title: { display: true, text: "Participants" },
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.05)" },
          ticks: {
            color: "#333",
            stepSize: 2000,
            callback: value => Math.round(value / 1000) * 1000
          }
        }
      }
    }
  });
  canvas.chart.reset();
  canvas.chart.update();
});

// Categories chart
let categoriesChart;

Reveal.on('slidechanged', event => {
  const canvas = event.currentSlide.querySelector('#categoriesChart');
  if (!canvas) return;

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  canvas.chart = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ["Work enviroment", "Biology", "Chemistry", "Geosciences and Space Sciences", "Mathematics / Computer Science", "Physics", "Engineering / Technology"],
      datasets: [{
        label: 'Projects',
        data: [3377, 390, 675, 1245, 870, 985, 1403],
        backgroundColor: [
          'rgba(72, 61, 139, 0.8)','rgba(65, 105, 225, 0.8)','rgba(28, 142, 182, 0.8)','rgba(63, 224, 208, 0.8)','rgba(0, 200, 83, 0.8)','rgba(255, 193, 7, 0.8)','rgba(96, 125, 139, 0.8)'
        ],
        hoverBackgroundColor: [
          'rgba(72, 61, 139, 1)','rgba(65, 105, 225, 1)','rgba(28, 142, 182, 1)','rgba(63, 224, 208, 1)','rgba(0, 200, 83, 1)','rgba(255, 193, 7, 1)','rgba(96, 125, 139, 1)'
        ],
        borderColor: 'rgba(255, 255, 255, 255)',
        borderWidth: 2,
        hoverOffset: 20,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '60%',
      layout: {
        padding: 30
      },
      animation: {
        animateRotate: true,
        animateScale: false,
        duration: 2200,
        easing: 'easeInOutExpo'
      },
      plugins: {
        title: {
          display: true,
          text: 'Projects by Field',
          font: { size: 22, weight: 'bold' },
          color: "#111"
        },
        legend: {
          position: 'right',
          labels: {
            padding: 20,
            boxWidth: 15,
            color: "#111"
          }
        },
        tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: 10,
        }
      }
    }
  });
  canvas.chart.reset();
  canvas.chart.update();
});

// Temperature animation thing
let tempState = {
    isFahrenheit: false,
    lastSlideIndex: -1,
    isAnimating: false
};

// Temperature conversion animation
Reveal.on('slidechanged', function(event) {
    const temperatureEl = document.getElementById('temperature');
    if (!temperatureEl) return;

    if (event.currentSlide.contains(temperatureEl)) {
        // Always reset to Celsius when arriving at this slide
        temperatureEl.innerHTML = '<span class="celsius-value">-50 °C</span>';
        temperatureEl.className = '';
        tempState.isFahrenheit = false;
        tempState.isAnimating = false;

        // Always reset fragments when arriving at the slide
        const fragments = event.currentSlide.querySelectorAll('.fragment');
        fragments.forEach(fragment => {
            fragment.classList.remove('visible');
            fragment.classList.remove('current-fragment');
        });
    }
});

Reveal.on('fragmentshown', function(event) {
    const temperatureEl = document.getElementById('temperature');
    if (temperatureEl && event.fragment.classList.contains('convert-temp') && !tempState.isAnimating) {
        tempState.isAnimating = true;

        // Remove any previous animation classes
        temperatureEl.classList.remove('fade-in');
        temperatureEl.classList.remove('fade-out');

        // Start fade out
        temperatureEl.classList.add('fade-out');

        setTimeout(() => {
            // Switch temperature after fade out
            if (!tempState.isFahrenheit) {
                temperatureEl.innerHTML = '<span class="fahrenheit-value">-58 °F</span>';
                tempState.isFahrenheit = true;
            } else {
                temperatureEl.innerHTML = '<span class="celsius-value">-50 °C</span>';
                tempState.isFahrenheit = false;
            }
            // Fade in
            temperatureEl.classList.remove('fade-out');
            temperatureEl.classList.add('fade-in');
            tempState.isAnimating = false;
        }, 350); // match transition duration
    }
});

// Altitude animation thing
let altitudeState = {
    isFeet: false,
    isAnimating: false
};

// Altitude conversion animation reset (add this block)
Reveal.on('slidechanged', function(event) {
    const altitudeEl = document.getElementById('altitude');
    if (!altitudeEl) return;

    if (event.currentSlide.contains(altitudeEl)) {
        // Always reset to metres when arriving at this slide
        altitudeEl.innerHTML = '<span class="metres-value">25,000m</span>';
        altitudeEl.className = '';
        altitudeState.isFeet = false;
        altitudeState.isAnimating = false;

        // Always reset fragments when arriving at the slide
        const fragments = event.currentSlide.querySelectorAll('.fragment');
        fragments.forEach(fragment => {
            fragment.classList.remove('visible');
            fragment.classList.remove('current-fragment');
        });
    }
});

// Altitude conversion animation
Reveal.on('fragmentshown', function(event) {
    const altitudeEl = document.getElementById('altitude');
    if (altitudeEl && event.fragment.classList.contains('convert-altitude') && !altitudeState.isAnimating) {
        altitudeState.isAnimating = true;

        const valueSpan = altitudeEl.querySelector('span');
        if (!valueSpan) return;

        valueSpan.classList.remove('fade-in', 'fade-out');
        valueSpan.classList.add('fade-out');

        setTimeout(() => {
            if (!altitudeState.isFeet) {
                valueSpan.textContent = '82,000ft';
                valueSpan.classList.remove('metres-value');
                valueSpan.classList.add('feet-value');
                altitudeState.isFeet = true;
            } else {
                valueSpan.textContent = '25,000m';
                valueSpan.classList.remove('feet-value');
                valueSpan.classList.add('metres-value');
                altitudeState.isFeet = false;
            }
            valueSpan.classList.remove('fade-out');
            valueSpan.classList.add('fade-in');
            altitudeState.isAnimating = false;
        }, 350);
    }
});
