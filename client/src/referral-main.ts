// Referral form functionality

interface ReferrerInfo {
  firstName: string;
  lastName: string;
}

/**
 * Decode Base64-encoded referrer information from URL parameter
 * Format: VSOL:FirstName:LastName
 */
function decodeReferrerInfo(encodedData: string): ReferrerInfo | null {
  try {
    const decoded = atob(encodedData);
    const parts = decoded.split(':');
    
    if (parts.length !== 3 || parts[0] !== 'VSOL') {
      return null; // Invalid format
    }
    
    return {
      firstName: parts[1],
      lastName: parts[2]
    };
  } catch (error) {
    console.error('Failed to decode referrer info:', error);
    return null;
  }
}

/**
 * Extract ref parameter from URL
 */
function getRefParameter(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref');
}

/**
 * Update greeting with referrer information
 */
function updateGreeting(referrerInfo: ReferrerInfo | null) {
  const greetingElement = document.getElementById('greeting');
  const subtitleElement = document.getElementById('subtitle');
  const nameFields = document.getElementById('nameFields');
  
  if (!greetingElement || !subtitleElement) return;
  
  if (referrerInfo) {
    greetingElement.textContent = `Hello ${referrerInfo.firstName} ${referrerInfo.lastName}!`;
    subtitleElement.textContent = 'Thank you for helping us connect with potential clients.';
    // Hide name fields when we have referrer info from URL
    if (nameFields) {
      nameFields.style.display = 'none';
    }
  } else {
    greetingElement.textContent = 'Welcome!';
    subtitleElement.textContent = 'Please enter your referral information below.';
    // Show name fields when no referrer info in URL
    if (nameFields) {
      nameFields.style.display = 'block';
    }
  }
}

/**
 * Validate LinkedIn URL format
 */
function validateLinkedInUrl(url: string): boolean {
  const pattern = /^https?:\/\/([a-z]+\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  return pattern.test(url);
}

/**
 * Validate email format
 */
function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Clean phone number (remove non-numeric characters except +)
 */
function cleanPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Show error message for a field
 */
function showFieldError(fieldId: string, message: string) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  const inputElement = document.getElementById(fieldId) as HTMLInputElement;
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  if (inputElement) {
    inputElement.classList.add('error');
  }
}

/**
 * Clear error message for a field
 */
function clearFieldError(fieldId: string) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  const inputElement = document.getElementById(fieldId) as HTMLInputElement;
  
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
  
  if (inputElement) {
    inputElement.classList.remove('error');
  }
}

/**
 * Show success message
 */
function showSuccessMessage(referralEmail: string) {
  const successMessage = document.getElementById('successMessage');
  const successText = document.getElementById('successText');
  const errorMessage = document.getElementById('errorMessage');
  
  if (successMessage) {
    successMessage.style.display = 'block';
  }
  
  if (successText) {
    successText.textContent = `We've received your submission and will reach out to ${referralEmail} soon.`;
  }
  
  if (errorMessage) {
    errorMessage.style.display = 'none';
  }
  
  // Scroll to success message
  successMessage?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Show error message
 */
function showErrorMessage(message: string) {
  const errorMessage = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');
  const successMessage = document.getElementById('successMessage');
  
  if (errorMessage) {
    errorMessage.style.display = 'block';
  }
  
  if (errorText) {
    errorText.textContent = message;
  }
  
  if (successMessage) {
    successMessage.style.display = 'none';
  }
  
  // Scroll to error message
  errorMessage?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hide all messages
 */
function hideMessages() {
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  
  if (successMessage) {
    successMessage.style.display = 'none';
  }
  
  if (errorMessage) {
    errorMessage.style.display = 'none';
  }
}

/**
 * Set loading state for submit button
 */
function setLoadingState(loading: boolean) {
  const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
  const buttonText = document.getElementById('buttonText');
  const buttonSpinner = document.getElementById('buttonSpinner');
  
  if (submitBtn) {
    submitBtn.disabled = loading;
  }
  
  if (buttonText) {
    buttonText.style.display = loading ? 'none' : 'inline';
  }
  
  if (buttonSpinner) {
    buttonSpinner.style.display = loading ? 'inline-block' : 'none';
  }
}

/**
 * Parse full name into first and last name
 */
function parseFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
}

/**
 * Clear form fields
 */
function clearForm() {
  const form = document.getElementById('referralForm') as HTMLFormElement;
  if (form) {
    form.reset();
  }
  
  // Clear all error states
  clearFieldError('fullName');
  clearFieldError('linkedinUrl');
  clearFieldError('email');
}

/**
 * Handle form submission
 */
async function handleSubmit(event: Event, referrerInfo: ReferrerInfo | null) {
  event.preventDefault();
  
  // Hide any existing messages
  hideMessages();
  
  // Clear previous errors
  clearFieldError('fullName');
  clearFieldError('linkedinUrl');
  clearFieldError('email');
  
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  
  const linkedinUrl = (formData.get('linkedinUrl') as string).trim();
  const email = (formData.get('email') as string).trim();
  const phone = (formData.get('phone') as string).trim();
  const about = (formData.get('about') as string).trim();
  const website = formData.get('website') as string; // Honeypot
  
  // Get name from form if no referrer info from URL
  let firstName: string;
  let lastName: string;
  
  if (referrerInfo) {
    firstName = referrerInfo.firstName;
    lastName = referrerInfo.lastName;
  } else {
    const fullName = (formData.get('fullName') as string || '').trim();
    if (!fullName) {
      showFieldError('fullName', 'Please enter your name');
      return;
    }
    const parsedName = parseFullName(fullName);
    firstName = parsedName.firstName;
    lastName = parsedName.lastName;
  }
  
  // Validation
  let hasError = false;
  
  if (!linkedinUrl) {
    showFieldError('linkedinUrl', 'Please enter a LinkedIn profile URL');
    hasError = true;
  } else if (!validateLinkedInUrl(linkedinUrl)) {
    showFieldError('linkedinUrl', 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)');
    hasError = true;
  }
  
  if (!email) {
    showFieldError('email', 'Please enter an email address');
    hasError = true;
  } else if (!validateEmail(email)) {
    showFieldError('email', 'Please enter a valid email address');
    hasError = true;
  }
  
  if (hasError) {
    return;
  }
  
  // Prepare request body
  const requestBody = {
    referrerFirstName: firstName,
    referrerLastName: lastName,
    linkedinUrl,
    email,
    phone: phone ? cleanPhone(phone) : undefined,
    about: about || undefined,
    website, // Include honeypot field
  };
  
  // Set loading state
  setLoadingState(true);
  
  try {
    const response = await fetch('/api/referral/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      // Success!
      showSuccessMessage(email);
      clearForm();
    } else {
      // Server returned an error
      showErrorMessage(data.error || 'Failed to submit referral. Please try again.');
    }
  } catch (error) {
    console.error('Submission error:', error);
    showErrorMessage('Unable to submit referral. Please check your connection and try again.');
  } finally {
    setLoadingState(false);
  }
}

/**
 * Initialize the page
 */
function init() {
  // Set current year in footer
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear().toString();
  }
  
  // Get and decode referrer info
  const refParam = getRefParameter();
  let referrerInfo: ReferrerInfo | null = null;
  
  if (refParam) {
    referrerInfo = decodeReferrerInfo(refParam);
  }
  
  // Update greeting
  updateGreeting(referrerInfo);
  
  // Set up form submission
  const form = document.getElementById('referralForm');
  if (form) {
    form.addEventListener('submit', (e) => handleSubmit(e, referrerInfo));
  }
  
  // Add input event listeners for real-time validation feedback
  const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
  if (fullNameInput) {
    fullNameInput.addEventListener('input', () => {
      if (fullNameInput.classList.contains('error')) {
        clearFieldError('fullName');
      }
    });
  }
  
  const linkedinInput = document.getElementById('linkedinUrl') as HTMLInputElement;
  if (linkedinInput) {
    linkedinInput.addEventListener('blur', () => {
      const value = linkedinInput.value.trim();
      if (value && !validateLinkedInUrl(value)) {
        showFieldError('linkedinUrl', 'Please enter a valid LinkedIn profile URL');
      } else {
        clearFieldError('linkedinUrl');
      }
    });
    
    linkedinInput.addEventListener('input', () => {
      if (linkedinInput.classList.contains('error')) {
        clearFieldError('linkedinUrl');
      }
    });
  }
  
  const emailInput = document.getElementById('email') as HTMLInputElement;
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const value = emailInput.value.trim();
      if (value && !validateEmail(value)) {
        showFieldError('email', 'Please enter a valid email address');
      } else {
        clearFieldError('email');
      }
    });
    
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('error')) {
        clearFieldError('email');
      }
    });
  }
  
  // Add event listener for "Add Another Referral" button
  const addAnotherBtn = document.getElementById('addAnotherBtn');
  if (addAnotherBtn) {
    addAnotherBtn.addEventListener('click', () => {
      hideMessages();
      clearForm();
      // Scroll to top of form
      const formContainer = document.querySelector('.form-container');
      if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

