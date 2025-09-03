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

  participantsChart1 = new Chart(canvas, {
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
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      },
      plugins: {
        title: {
          display: true,
          text: 'Jugend forscht Participants Over Time',
          font: { size: 20 }
        },
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: 'Year' } },
        y: { title: { display: true, text: 'Participants' }, beginAtZero: true }
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

  participantsChart2 = new Chart(canvas, {
    type: 'line',
    data: {
      labels: [1966, 1971, 1980, 1990, 2000, 2010, 2020, 2025],
      datasets: [{
        label: 'Participants',
        data: [244, 1402, 1565, 3207, 6980, 10196, 11768, 10350],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      },
      plugins: {
        title: {
          display: true,
          text: 'Jugend forscht Participants Over Time',
          font: { size: 20 }
        },
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: 'Year' } },
        y: { title: { display: true, text: 'Participants' }, beginAtZero: true }
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
    type: 'pie',
    data: {
      labels: ["Arbeitswelt", "Biologie", "Chemie", "Geo- und Raumwissenschaften", "Mathematik/Informatik", "Physik", "Technik"],
      datasets: [{
        data: [3377, 390, 675, 1245, 870, 985, 1403],
        backgroundColor: [
            'rgba(128, 128, 128, 0.7)',
            'rgba(0, 200, 83, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(255, 87, 34, 0.7)',
            'rgba(33, 150, 243, 0.7)',
            'rgba(156, 39, 176, 0.7)',
            'rgba(96, 125, 139, 0.7)'
        ],
        borderColor: [
            'rgba(128, 128, 128, 1)',
            'rgba(0, 200, 83, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(255, 87, 34, 1)',
            'rgba(33, 150, 243, 1)',
            'rgba(156, 39, 176, 1)',
            'rgba(96, 125, 139, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
        easing: 'easeOutQuart'
      },
      plugins: {
        title: {
          display: true,
          text: 'Example Pie Chart',
          font: { size: 20 }
        },
        legend: { position: 'bottom' }
      }
    }
  });

  canvas.chart.reset();
  canvas.chart.update();
});
