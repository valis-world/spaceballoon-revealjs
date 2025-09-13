// This file initializes the reveal.js presentation and contains custom javascript for animations and slide-specific interactions.
let animationState = {
    timeoutId: null,
    animationFrameId: null
};

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

    if (event.indexh === 2 && event.indexv === 0) {
        const target = 10000;
        const duration = 4000;
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

let participantsChart1;

Reveal.on('slidechanged', event => {
  const canvas = event.currentSlide.querySelector('#participantsChart1');
  if (!canvas) return;

  if (participantsChart1) {
    participantsChart1.destroy();
  }

  const ctx = canvas.getContext("2d");

  participantsChart1 = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975,
                1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985,
                1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
                1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005,
                2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
                2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      datasets: [{
        label: 'Participants',
        data: [244, 476, 560, 631, 627, 1402, 1367, 1269, 889, 1215,
                1049, 1385, 1795, 1204, 1565, 1713, 2056, 2220, 2287, 2460,
                2285, 2545, 2653, 2970, 3207, 3603, 3636, 3995, 4110, 4291,
                4876, 5520, 6431, 6813, 6980, 7168, 7620, 8153, 8315, 8945,
                9603, 9121, 10102, 10061, 10196, 10677, 10914, 11411, 12298, 11502,
                12058, 12226, 12069, 12150, 11768, 8998, 8527, 9386, 10492, 10350],
        borderColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) { return null; }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(2,175,177,1)");
          gradient.addColorStop(0.5, "rgba(28,142,182,1)");
          gradient.addColorStop(1, "rgba(54,99,187,1)");
          return gradient;
        },
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) { return null; }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(2,175,177,0.6)");
          gradient.addColorStop(0.5, "rgba(28,142,182,0.4)");
          gradient.addColorStop(1, "rgba(54,99,187,0.3)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: "white",
        pointBorderColor: function(context) {
          const chart = context.chart;
          const yScale = chart.scales.y;
          const value = context.dataset.data[context.dataIndex];
          
          if (!yScale || yScale.min === undefined || yScale.max === undefined || yScale.min === yScale.max) {
            return 'rgba(2,175,177,1)';
          }

          const colorStops = {
            c1: { r: 2, g: 175, b: 177 },
            c2: { r: 28, g: 142, b: 182 },
            c3: { r: 54, g: 99, b: 187 }
          };

          const yPercent = (value - yScale.min) / (yScale.max - yScale.min);
          const gradientPercent = 1 - yPercent;

          let r, g, b;

          if (gradientPercent <= 0.5) {
            const interPercent = gradientPercent / 0.5;
            r = Math.round(colorStops.c1.r * (1 - interPercent) + colorStops.c2.r * interPercent);
            g = Math.round(colorStops.c1.g * (1 - interPercent) + colorStops.c2.g * interPercent);
            b = Math.round(colorStops.c1.b * (1 - interPercent) + colorStops.c2.b * interPercent);
          } else {
            const interPercent = (gradientPercent - 0.5) / 0.5;
            r = Math.round(colorStops.c2.r * (1 - interPercent) + colorStops.c3.r * interPercent);
            g = Math.round(colorStops.c2.g * (1 - interPercent) + colorStops.c3.g * interPercent);
            b = Math.round(colorStops.c2.b * (1 - interPercent) + colorStops.c3.b * interPercent);
          }

          return `rgba(${r}, ${g}, ${b}, 1)`;
        },
        pointBorderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 2000,
        easing: "easeOutBounce"
      },
      plugins: {
        title: {
          display: true,
          text: "Jugend forscht Participants Over Time",
          font: { size: 22, weight: "bold" }
        },
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          displayColors: false
        }
      },
      scales: {
        x: {
          title: { display: true, text: "Year" },
          grid: { color: "rgba(200,200,200,0.2)" }
        },
        y: {
          title: { display: true, text: "Participants" },
          beginAtZero: true,
          grid: { color: "rgba(200,200,200,0.2)" }
        }
      }
    }
  });
});

let participantsChart2;

Reveal.on('slidechanged', event => {
  const canvas = event.currentSlide.querySelector('#participantsChart2');
  if (!canvas) return;

  if (participantsChart2) {
    participantsChart2.destroy();
  }

  const ctx = canvas.getContext("2d");

  participantsChart2 = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [1966, 1971, 1980, 1990, 2000, 2010, 2020, 2025],
      datasets: [{
        label: 'Participants',
        data: [244, 1402, 1565, 3207, 6980, 10196, 11768, 10350],
        borderColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) { return null; }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(2,175,177,1)");
          gradient.addColorStop(0.5, "rgba(28,142,182,1)");
          gradient.addColorStop(1, "rgba(54,99,187,1)");
          return gradient;
        },
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) { return null; }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(2,175,177,0.6)");
          gradient.addColorStop(0.5, "rgba(28,142,182,0.4)");
          gradient.addColorStop(1, "rgba(54,99,187,0.3)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: "white",
        pointBorderColor: function(context) {
          const chart = context.chart;
          const yScale = chart.scales.y;
          const value = context.dataset.data[context.dataIndex];
          
          if (!yScale || yScale.min === undefined || yScale.max === undefined || yScale.min === yScale.max) {
            return 'rgba(2,175,177,1)';
          }

          const colorStops = {
            c1: { r: 2, g: 175, b: 177 },
            c2: { r: 28, g: 142, b: 182 },
            c3: { r: 54, g: 99, b: 187 }
          };

          const yPercent = (value - yScale.min) / (yScale.max - yScale.min);
          const gradientPercent = 1 - yPercent;

          let r, g, b;

          if (gradientPercent <= 0.5) {
            const interPercent = gradientPercent / 0.5;
            r = Math.round(colorStops.c1.r * (1 - interPercent) + colorStops.c2.r * interPercent);
            g = Math.round(colorStops.c1.g * (1 - interPercent) + colorStops.c2.g * interPercent);
            b = Math.round(colorStops.c1.b * (1 - interPercent) + colorStops.c2.b * interPercent);
          } else {
            const interPercent = (gradientPercent - 0.5) / 0.5;
            r = Math.round(colorStops.c2.r * (1 - interPercent) + colorStops.c3.r * interPercent);
            g = Math.round(colorStops.c2.g * (1 - interPercent) + colorStops.c3.g * interPercent);
            b = Math.round(colorStops.c2.b * (1 - interPercent) + colorStops.c3.b * interPercent);
          }

          return `rgba(${r}, ${g}, ${b}, 1)`;
        },
        pointBorderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 2000,
        easing: "easeOutBounce"
      },
      plugins: {
        title: {
          display: true,
          text: "Jugend forscht Participants Over Time",
          font: { size: 22, weight: "bold" }
        },
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          displayColors: false
        }
      },
      scales: {
        x: {
          title: { display: true, text: "Year" },
          grid: { color: "rgba(200,200,200,0.2)" }
        },
        y: {
          title: { display: true, text: "Participants" },
          beginAtZero: true,
          grid: { color: "rgba(200,200,200,0.2)" }
        }
      }
    }
  });
});


let pieChart;

Reveal.on('slidechanged', event => {
  const canvas = event.currentSlide.querySelector('#pieChart');
  if (!canvas) return;

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  canvas.chart = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ["World of Work", "Biology", "Chemistry", "Geosciences and Space Sciences", "Mathematics / Computer Science", "Physics", "Engineering / Technology"],
      datasets: [{
        label: 'Projects',
        data: [3377, 390, 675, 1245, 870, 985, 1403],
        backgroundColor: [
          'rgba(72, 61, 139, 0.8)','rgba(65, 105, 225, 0.8)','rgba(28, 142, 182, 0.8)','rgba(63, 224, 208, 0.8)','rgba(0, 200, 83, 0.8)','rgba(255, 193, 7, 0.8)','rgba(96, 125, 139, 0.8)'
        ],
        hoverBackgroundColor: [
          'rgba(72, 61, 139, 1)','rgba(65, 105, 225, 1)','rgba(28, 142, 182, 1)','rgba(63, 224, 208, 1)','rgba(0, 200, 83, 1)','rgba(255, 193, 7, 1)','rgba(96, 125, 139, 1)'
        ],
        borderColor: 'rgba(255, 255, 255, 0.5)',
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
        animateScale: true,
        duration: 2000,
        easing: 'easeOutQuart'
      },
      plugins: {
        title: {
          display: true,
          text: 'Projects by Field',
          font: { size: 22, weight: 'bold' }
        },
        legend: {
          position: 'right',
          labels: {
            padding: 20,
            boxWidth: 15
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

let Altitude;

Reveal.on('slidechanged', event => {
  const canvas = event.currentSlide.querySelector('#Altitude');
  if (!canvas) return;

  if (Altitude) {
    Altitude.destroy();
  }

  const ctx = canvas.getContext("2d");

  Altitude = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68,
              72, 76, 80, 84, 88, 82, 86, 90, 94, 98, 102, 106, 110, 114, 118, 122,
              126, 130, 134, 138, 142, 146, 50, 154, 158, 162, 166, 170, 174], // Data needed
      datasets: [{
        label: 'Altitude',
        data: [450, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
              11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000,
              21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000, 30000,
              28000, 26000, 24000, 22000, 20000, 18000, 16000, 14000, 12000, 10000,
              8000, 6000, 4000, 2000, 400], // Data needed
        borderColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) { return null; }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(2,175,177,1)");
          gradient.addColorStop(0.5, "rgba(28,142,182,1)");
          gradient.addColorStop(1, "rgba(54,99,187,1)");
          return gradient;
        },
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) { return null; }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(2,175,177,0.6)");
          gradient.addColorStop(0.5, "rgba(28,142,182,0.4)");
          gradient.addColorStop(1, "rgba(54,99,187,0.3)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: "white",
        pointBorderColor: function(context) {
          const chart = context.chart;
          const yScale = chart.scales.y;
          const value = context.dataset.data[context.dataIndex];
          
          if (!yScale || yScale.min === undefined || yScale.max === undefined || yScale.min === yScale.max) {
            return 'rgba(2,175,177,1)';
          }

          const colorStops = {
            c1: { r: 2, g: 175, b: 177 },
            c2: { r: 28, g: 142, b: 182 },
            c3: { r: 54, g: 99, b: 187 }
          };

          const yPercent = (value - yScale.min) / (yScale.max - yScale.min);
          const gradientPercent = 1 - yPercent;

          let r, g, b;

          if (gradientPercent <= 0.5) {
            const interPercent = gradientPercent / 0.5;
            r = Math.round(colorStops.c1.r * (1 - interPercent) + colorStops.c2.r * interPercent);
            g = Math.round(colorStops.c1.g * (1 - interPercent) + colorStops.c2.g * interPercent);
            b = Math.round(colorStops.c1.b * (1 - interPercent) + colorStops.c2.b * interPercent);
          } else {
            const interPercent = (gradientPercent - 0.5) / 0.5;
            r = Math.round(colorStops.c2.r * (1 - interPercent) + colorStops.c3.r * interPercent);
            g = Math.round(colorStops.c2.g * (1 - interPercent) + colorStops.c3.g * interPercent);
            b = Math.round(colorStops.c2.b * (1 - interPercent) + colorStops.c3.b * interPercent);
          }

          return `rgba(${r}, ${g}, ${b}, 1)`;
        },
        pointBorderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 2000,
        easing: "easeOutBounce"
      },
      plugins: {
        title: {
          display: true,
          text: "Jugend forscht Participants Over Time",
          font: { size: 22, weight: "bold" }
        },
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          displayColors: false
        }
      },
      scales: {
        x: {
          title: { display: true, text: "Year" },
          grid: { color: "rgba(200,200,200,0.2)" }
        },
        y: {
          title: { display: true, text: "Participants" },
          beginAtZero: true,
          grid: { color: "rgba(200,200,200,0.2)" }
        }
      }
    }
  });
});
