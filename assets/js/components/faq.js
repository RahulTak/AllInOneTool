export function renderFaq(faqs = []) {
    if (!faqs || faqs.length === 0) return '';

    return `
    <section class="faq-section" id="faq-section">
        <h2 class="faq-title">Frequently Asked Questions</h2>
        <div class="faq-list">
            ${faqs.map((faq, index) => `
                <div class="faq-item" data-index="${index}">
                    <button class="faq-question" aria-expanded="false" aria-controls="faq-ans-${index}">
                        ${faq.question}
                    </button>
                    <div class="faq-answer" id="faq-ans-${index}" role="region">
                        <div class="faq-answer-inner">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
    `;
}

export function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');
        
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(el => {
                el.classList.remove('active');
                el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                el.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Open clicked item if it was not active
            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
                answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
            }
        });
    });
}
