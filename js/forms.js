/**
 * Forms Manager: Handles floating label focus behaviors, validations, file upload constraints, and success transitions.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Floating Label Fallback Focus State
  const formControls = document.querySelectorAll('.form-control');
  formControls.forEach(control => {
    control.addEventListener('focus', () => {
      control.parentElement.classList.add('focused');
    });

    control.addEventListener('blur', () => {
      control.parentElement.classList.remove('focused');
      if (control.value.trim() !== '') {
        control.parentElement.classList.add('has-value');
      } else {
        control.parentElement.classList.remove('has-value');
      }
    });
    
    // Initial check
    if (control.value.trim() !== '') {
      control.parentElement.classList.add('has-value');
    }
  });

  // 2. File Upload Change handler
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const fileWrap = input.closest('.file-upload-wrap');
      const label = fileWrap ? fileWrap.querySelector('.file-upload-label') : null;
      if (label && input.files.length > 0) {
        const file = input.files[0];
        // Validate file type & size (5MB max)
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(file.type)) {
          alert('Invalid file format. Please upload JPG, PNG, or PDF.');
          input.value = '';
          label.innerHTML = 'Drag & Drop moodboards or <span>Browse</span>';
          return;
        }

        if (file.size > maxSize) {
          alert('File size exceeds the 5MB limit.');
          input.value = '';
          label.innerHTML = 'Drag & Drop moodboards or <span>Browse</span>';
          return;
        }

        label.innerHTML = `Selected: <strong>${file.name}</strong> (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
      }
    });
  });

  // 3. Client Inquiry Form Validation
  const inquiryForm = document.getElementById('client-inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const errors = [];
      const name = inquiryForm.querySelector('#inquiry-name');
      const email = inquiryForm.querySelector('#inquiry-email');
      const phone = inquiryForm.querySelector('#inquiry-phone');
      const date = inquiryForm.querySelector('#inquiry-date');
      
      // Reset past messages
      const msgBox = inquiryForm.querySelector('.form-message');
      if (msgBox) msgBox.className = 'form-message';

      if (!name || name.value.trim() === '') errors.push('Name is required.');
      
      if (!email || email.value.trim() === '') {
        errors.push('Email is required.');
      } else if (!validateEmail(email.value.trim())) {
        errors.push('Please enter a valid email address.');
      }

      if (phone && phone.value.trim() !== '' && !validatePhone(phone.value.trim())) {
        errors.push('Please enter a valid phone number (minimum 10 digits).');
      }

      if (!date || date.value.trim() === '') {
        errors.push('Preferred shoot date is required.');
      }

      if (errors.length > 0) {
        showFormMessage(inquiryForm, errors.join('<br>'), 'error');
      } else {
        // Success Animation State
        showFormMessage(inquiryForm, '<h4>Inquiry Received.</h4><p style="margin:0;">Thank you! We will review your project details and respond within 24 hours.</p>', 'success');
        inquiryForm.reset();
        const uploadLabel = inquiryForm.querySelector('.file-upload-label');
        if (uploadLabel) uploadLabel.innerHTML = 'Drag & Drop moodboards or <span>Browse</span>';
        
        // Remove focus labels
        formControls.forEach(c => c.parentElement.classList.remove('has-value'));
      }
    });
  }

  // 4. Rate Card Request Form Validation
  const rateForm = document.getElementById('rate-card-form');
  if (rateForm) {
    rateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const errors = [];
      const name = rateForm.querySelector('#rate-name');
      const email = rateForm.querySelector('#rate-email');
      const businessType = rateForm.querySelector('#rate-business-type');
      
      const msgBox = rateForm.querySelector('.form-message');
      if (msgBox) msgBox.className = 'form-message';

      if (!name || name.value.trim() === '') errors.push('Name is required.');
      
      if (!email || email.value.trim() === '') {
        errors.push('Email is required.');
      } else if (!validateEmail(email.value.trim())) {
        errors.push('Please enter a valid email address.');
      }

      if (errors.length > 0) {
        showFormMessage(rateForm, errors.join('<br>'), 'error');
      } else {
        showFormMessage(rateForm, '<h4>Request Sent!</h4><p style="margin:0;">Your rate card request has been received. Expect details in your inbox momentarily.</p>', 'success');
        rateForm.reset();
        formControls.forEach(c => c.parentElement.classList.remove('has-value'));
      }
    });
  }

  // Helper validation logic
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  }

  function showFormMessage(form, text, type) {
    let msgBox = form.querySelector('.form-message');
    if (!msgBox) {
      msgBox = document.createElement('div');
      msgBox.className = 'form-message';
      form.appendChild(msgBox);
    }
    msgBox.innerHTML = text;
    msgBox.className = `form-message ${type}`;
    msgBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
