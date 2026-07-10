document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Intersection Observer for Smooth Scroll Animations
    // هذه التقنية تجعل الأقسام تظهر بحركة انسيابية عند الوصول إليها
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // إيقاف المراقبة بعد الظهور
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // 2. 3D Tilt Effect for Domain Cards
    // هذا الكود يضيف ميلاناً للبطاقة يتبع حركة الماوس
    const cards = document.querySelectorAll('.domain-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // موقع الماوس بالنسبة للبطاقة (X)
            const y = e.clientY - rect.top;  // موقع الماوس بالنسبة للبطاقة (Y)
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // درجة الميلان العمودي
            const rotateY = ((x - centerX) / centerX) * 10;  // درجة الميلان الأفقي
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // إعادة البطاقة لوضعها الطبيعي عند خروج الماوس
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            // إضافة انتقال ناعم عند العودة
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                card.style.transition = ''; // إزالة الانتقال حتى لا يؤثر على حركة الماوس
            }, 500);
        });
    });

    // 3. Copy to Clipboard Functionality
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const domainText = card.getAttribute('data-domain');
            
            navigator.clipboard.writeText(domainText).then(() => {
                showToast(domainText);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

    // 4. Toast Notification Logic
    let toastTimeout;
    const toast = document.getElementById('toast');
    const toastText = toast.querySelector('.toast-text');

    function showToast(domainName) {
        // تحديث النص
        toastText.innerText = `${domainName} copied securely`;
        
        // إظهار الإشعار
        toast.classList.add('show');
        
        // إعادة ضبط المؤقت إذا قام بالنسخ المتتالي
        clearTimeout(toastTimeout);
        
        // إخفاء الإشعار بعد 3 ثوانٍ
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
