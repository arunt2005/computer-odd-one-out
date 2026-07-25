const quizData = [
    {
    "num": 1,
    "title": "Find the odd one out:",
    "options": ["RAM", "CD", "DVD", "Pen Drive"],
    "answer": "RAM",
    "explanation": "<strong>RAM</strong> is a primary volatile memory, whereas CD, DVD, and Pen Drive are secondary non-volatile storage devices."
  },
  {
    "num": 2,
    "title": "Find the odd one out:",
    "options": ["Touchscreen", "LCD Projector", "Scanner", "Biometric device"],
    "answer": "LCD Projector",
    "explanation": "<strong>LCD Projector</strong> is strictly an output device, whereas Touchscreen, Scanner, and Biometric device act as input devices."
  },
  {
    "num": 3,
    "title": "Find the odd one out:",
    "options": ["Plotter", "Printer", "OMR", "Monitor"],
    "answer": "OMR",
    "explanation": "<strong>OMR</strong> (Optical Mark Reader) is an input device, whereas Plotter, Printer, and Monitor are output devices."
  },
  {
    "num": 4,
    "title": "Find the odd one out:",
    "options": ["Dot-matrix printer", "Daisy wheel printer", "Line printer", "Laser printer"],
    "answer": "Laser printer",
    "explanation": "<strong>Laser printer</strong> is a non-impact printer, whereas Dot-matrix, Daisy wheel, and Line printers are impact printers."
  },
  {
    "num": 5,
    "title": "Find the odd one out:",
    "options": ["Scanner", "Bar code reader", "Digital Camera", "Plotter"],
    "answer": "Plotter",
    "explanation": "<strong>Plotter</strong> is an output device used for printing graphics, whereas Scanner, Bar code reader, and Digital Camera are input devices."
  }
];

// Dynamically generate the single page structure using serial numbers
function renderQuiz() {
    const container = document.getElementById('questions-wrapper');
    container.innerHTML = '';

    quizData.forEach((q) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.id = `question-${q.num}`;

        let optionsHTML = '';
        q.options.forEach((option) => {
            optionsHTML += `
                <label class="radio-tile" data-option-value="${option}">
                    <input type="radio" name="question-${q.num}" value="${option}" required>
                    <span class="tile-label">${option}</span>
                </label>
            `;
        });

        card.innerHTML = `
            <div class="question-title">${q.num}. ${q.title}</div>
            <div class="options-grid">${optionsHTML}</div>
            <div class="explanation-panel" id="explain-${q.num}"></div>
        `;
        container.appendChild(card);
    });

    setupScrollSpy();
}

// Side Menu Navigation Highlighter tracking active numeric scroll space
function setupScrollSpy() {
    const mainContent = document.querySelector('.main-content');
    const navItems = document.querySelectorAll('.menu-item');
    
    mainContent.addEventListener('scroll', () => {
        let current = 1;
        quizData.forEach(q => {
            const el = document.getElementById(`question-${q.num}`);
            if (el && mainContent.scrollTop >= (el.offsetTop - 60)) {
                current = q.num;
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if(item.id === `nav-${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// Global Validation on click 'Submit Test'
function submitTest(event) {
    event.preventDefault();
    let score = 0;

    quizData.forEach((q) => {
        const selectedRadio = document.querySelector(`input[name="question-${q.num}"]:checked`);
        const card = document.getElementById(`question-${q.num}`);
        const explanationEl = document.getElementById(`explain-${q.num}`);
        
        // Disable choices after submission
        const allRadios = card.querySelectorAll('input[type="radio"]');
        allRadios.forEach(r => r.disabled = true);

        // Target matching DOM nodes
        const optionContainers = card.querySelectorAll('.radio-tile');
        
        optionContainers.forEach(container => {
            const val = container.getAttribute('data-option-value');
            if (val === q.answer) {
                container.classList.add('correct-ans'); // Highlight the right option in green
            }
            if (selectedRadio && val === selectedRadio.value && selectedRadio.value !== q.answer) {
                container.classList.add('wrong-ans'); // Highlight the user's mistake in red
            }
        });

        if (selectedRadio && selectedRadio.value === q.answer) {
            score++;
        }

        // Show analytical explanation text string
        explanationEl.innerHTML = q.explanation;
        explanationEl.style.display = 'block';
    });

    // Animate and show the final scores card component
    document.getElementById('action-panel').style.display = 'none';
    const resultsCard = document.getElementById('results-card');
    document.getElementById('score-badge').textContent = `${score} / ${quizData.length}`;
    
    // Performance text dynamic feedback
    const message = score === quizData.length ? "Perfect Score! Excellent Historical Knowledge!" : "Review the explanations above to learn more.";
    document.getElementById('performance-text').textContent = message;
    
    resultsCard.style.display = 'block';
    resultsCard.scrollIntoView({ behavior: 'smooth' });
}

function resetTest() {
    document.getElementById('results-card').style.display = 'none';
    document.getElementById('action-panel').style.display = 'flex';
    renderQuiz();
    document.querySelector('.main-content').scrollTop = 0;
}

// Bootstrapping the code script run
renderQuiz();