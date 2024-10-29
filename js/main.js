(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        } 
    });
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });



    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });

})(jQuery);
// Global variables
let currentStep = 0;
const totalSteps = 5;
let carousel;
let resultsModal;
let userAnswers = Array(totalSteps).fill(null);

// Progress update function
function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.querySelector('.progress-line-active').style.width = `${progress}%`;
    
    // Update step states
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    // Update back button visibility
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    }
}

// Option selection handler
function selectOption(button, questionIndex) {
    // Validate inputs
    if (!button || questionIndex < 0 || questionIndex >= totalSteps) return;

    // Remove selected class from all options in current question
    button.closest('.options-grid').querySelectorAll('.option-card').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    button.classList.add('selected');
    
    // Store answer
    userAnswers[questionIndex] = button.querySelector('span').textContent;
    
    // Auto advance after short delay
    setTimeout(() => {
        nextSlide();
    }, 500);
}

// Navigation functions
function nextSlide() {
    if (currentStep < totalSteps - 1) {
        currentStep++;
        carousel.next();
        updateProgress();
    } else {
        showResults();
    }
}

function previousSlide() {
    if (currentStep > 0) {
        currentStep--;
        carousel.prev();
        updateProgress();
    }
}

// Results handling
function showResults() {
    resultsModal.show();
}

function processAnswers(answers) {
    // Logic to process answers and return recommendations
    // This is a simplified example
    return {
        products: [
            {
                name: "Sản phẩm 1",
                description: "Phù hợp với mục tiêu của bạn",
                match: "95%"
            },
            // Add more products...
        ]
    };
}

function displayRecommendations(recommendations) {
    const resultsContainer = document.querySelector('#resultsModal .product-grid');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = recommendations.products.map(product => `
        <div class="product-card">
            <div class="product-match">${product.match} phù hợp</div>
            <h5>${product.name}</h5>
            <p>${product.description}</p>
        </div>
    `).join('');
}

// Reset quiz function
function restartQuiz() {
    currentStep = 0;
    userAnswers = Array(totalSteps).fill(null);
    
    // Reset UI elements
    document.querySelectorAll('.option-card').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset carousel
    carousel.to(0);
    updateProgress();
    
    // Hide results modal
    if (resultsModal) {
        resultsModal.hide();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    carousel = new bootstrap.Carousel(document.getElementById('personalizedCarousel'), {
        interval: false,
        wrap: false,
        touch: false
    });
    
    // Initialize results modal
    resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));
    
    // Initial progress update
    updateProgress();

    // Add modal close handler
    document.getElementById('recommendModal').addEventListener('hidden.bs.modal', function () {
        restartQuiz();
    });

    // Add keyboard navigation handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            previousSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
});
document.querySelectorAll('.quantity-input').forEach(wrapper => {
    const minusBtn = wrapper.querySelector('.minus');
    const plusBtn = wrapper.querySelector('.plus');
    const input = wrapper.querySelector('.quantity-value');

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value);
        if (currentValue > 1) {
            input.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value);
        input.value = currentValue + 1;
    });

    input.addEventListener('change', () => {
        if (input.value < 1) {
            input.value = 1;
        }
    });
});