(function () {
  const stars = document.querySelectorAll('.star');
  const ratingLabel = document.getElementById('rating-label');
  const submitRatingBtn = document.getElementById('submit-rating');
  const feedbackForm = document.getElementById('feedback-form');
  const feedbackError = document.getElementById('feedback-error');
  const skipReviewBtn = document.getElementById('skip-review');

  const labels = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent!'];
  let selectedRating = 0;

  // Star hover and click
  stars.forEach(function (star) {
    star.addEventListener('mouseenter', function () {
      highlightStars(parseInt(star.dataset.value));
    });

    star.addEventListener('mouseleave', function () {
      highlightStars(selectedRating);
    });

    star.addEventListener('click', function () {
      selectedRating = parseInt(star.dataset.value);
      highlightStars(selectedRating);
      ratingLabel.textContent = labels[selectedRating];
      submitRatingBtn.disabled = false;
    });
  });

  function highlightStars(count) {
    stars.forEach(function (s) {
      var val = parseInt(s.dataset.value);
      s.classList.toggle('active', val <= count);
    });
  }

  function showStep(stepId) {
    document.querySelectorAll('.step').forEach(function (step) {
      step.classList.remove('active');
    });
    document.getElementById(stepId).classList.add('active');
  }

  // Submit rating
  submitRatingBtn.addEventListener('click', function () {
    if (selectedRating === 0) return;

    if (selectedRating === 5) {
      showStep('google-step');
    } else {
      showStep('feedback-step');
    }
  });

  // Skip google review
  skipReviewBtn.addEventListener('click', function () {
    showStep('thankyou-step');
  });

  // Feedback form submit
  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();
    feedbackError.textContent = '';

    var feedback = document.getElementById('feedback').value.trim();
    if (!feedback) {
      feedbackError.textContent = 'Please tell us what went wrong.';
      return;
    }

    var submitBtn = document.getElementById('submit-feedback');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    var data = {
      rating: selectedRating,
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      feedback: feedback
    };

    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to send feedback');
        showStep('thankyou-step');
      })
      .catch(function () {
        feedbackError.textContent = 'Something went wrong. Please try again.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Feedback';
      });
  });

  // Load config (Google review URL)
  fetch('/api/config')
    .then(function (res) { return res.json(); })
    .then(function (config) {
      if (config.googleReviewUrl) {
        document.getElementById('google-review-link').href = config.googleReviewUrl;
      }
      if (config.businessName) {
        document.querySelector('h1').textContent = config.businessName;
        document.title = 'Rate Your Experience - ' + config.businessName;
      }
    })
    .catch(function () {
      // Use defaults if config fails to load
    });
})();
