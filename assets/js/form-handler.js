/**
 * form-handler.js
 * Universal form handler for MikroMedia Website
 * Sends form data to Google Sheets via NoCodeAPI
 */

$(document).ready(function () {
    console.log('MikroMedia Form Handler Initialized');

    // Handle any form that has the 'contact-form' id or class
    const forms = $('form#contact-form, form.contact-form, form#popupContactForm');

    forms.on('submit', async function (e) {
        e.preventDefault();
        console.log('Form submission detected');

        const currentForm = $(this);
        const submitBtn = currentForm.find('button[type="submit"]');
        const formResponse = currentForm.find('.ajax-response, .form-response');

        // 1. GATHER DATA
        const formData = {
            timestamp: new Date().toLocaleString(),
            name: currentForm.find('input[name="name"]').val(),
            email: currentForm.find('input[name="email"]').val(),
            subject: currentForm.find('input[name="subject"]').val() || 'No Website provided',
            message: currentForm.find('textarea[name="message"]').val(),
            source: document.title + ' - ' + (currentForm.attr('id') || 'General Form')
        };

        console.log('Gathered form data:', formData);

        // 2. GATHER INTERESTS
        const selectedInterests = [];
        $('.tp-contact-category-btn.active, .interest-btn.active').each(function () {
            selectedInterests.push($(this).text().trim());
        });
        formData.interests = selectedInterests.length > 0 ? selectedInterests.join(', ') : 'None selected';

        // 3. VALIDATION
        if (!formData.name || !formData.email || !formData.message) {
            console.error('Validation failed: Missing required fields');
            formResponse.removeClass('success').addClass('error').text('Please fill in all required fields.').show();
            return;
        }

        // 4. PREPARE UI
        const originalBtnHtml = submitBtn.html();
        submitBtn.prop('disabled', true);
        if (submitBtn.find('.text-1').length) {
            submitBtn.find('.text-1, .text-2').text('Sending...');
        } else if (submitBtn.find('.btn-text').length) {
            submitBtn.find('.btn-text').text('Sending...');
        } else {
            submitBtn.text('Sending...');
        }
        formResponse.removeClass('success error').hide();

        // 5. SEND TO NOCODEAPI
        if (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.nocodeapi && window.APP_CONFIG.nocodeapi.enabled) {
            try {
                const url = window.APP_CONFIG.nocodeapi.apiUrl + '?tabId=' + window.APP_CONFIG.nocodeapi.tabId;
                const rowData = [[
                    formData.timestamp,
                    formData.name,
                    formData.email,
                    formData.subject,
                    formData.message,
                    formData.interests,
                    formData.source
                ]];

                console.log('Sending to URL:', url);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(rowData)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Submission success:', result);
                    formResponse.removeClass('error').addClass('success').text(window.APP_CONFIG.contactForm.successMessage).show();
                    alert('Thank you! Your message has been sent successfully.');

                    currentForm[0].reset();
                    $('.tp-contact-category-btn, .interest-btn').removeClass('active');

                    if (currentForm.attr('id') === 'popupContactForm' || currentForm.parents('#contactPopup').length) {
                        setTimeout(() => {
                            $('#contactPopup').removeClass('active');
                            $('body').css('overflow', 'auto');
                            formResponse.hide();
                        }, 2000);
                    }
                } else {
                    const errorText = await response.text();
                    throw new Error('Server returned ' + response.status + ': ' + errorText);
                }
            } catch (error) {
                console.error('Submission failed:', error);
                formResponse.removeClass('success').addClass('error').text(window.APP_CONFIG.contactForm.errorMessage).show();
                alert('Oops! Something went wrong while sending the message. Error: ' + error.message);
            } finally {
                submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        } else {
            console.error('Config missing or NoCodeAPI disabled');
            formResponse.removeClass('success').addClass('error').text('System configuration error.').show();
            submitBtn.prop('disabled', false).html(originalBtnHtml);
        }
    });

    // Handle Newsletter form
    $('.tp-footer-newsletter-box form, .footer-newsletter form').on('submit', async function (e) {
        e.preventDefault();
        const currentForm = $(this);
        const email = currentForm.find('input').val();
        const submitBtn = currentForm.find('button');
        if (!email) return;

        const originalBtnHtml = submitBtn.html();
        submitBtn.prop('disabled', true);

        if (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.nocodeapi && window.APP_CONFIG.nocodeapi.enabled) {
            try {
                const url = window.APP_CONFIG.nocodeapi.apiUrl + '?tabId=' + window.APP_CONFIG.nocodeapi.tabId;
                const rowData = [[
                    new Date().toLocaleString(),
                    'Newsletter Subscriber',
                    email,
                    'Newsletter',
                    'Subscriber',
                    'Newsletter',
                    document.title + ' - Footer'
                ]];

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rowData)
                });

                if (response.ok) {
                    currentForm.find('input').val('');
                    alert('Thank you for subscribing!');
                } else {
                    throw new Error('Subscription failed');
                }
            } catch (err) {
                console.error(err);
                alert('Subscription failed. Please try again.');
            } finally {
                submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        }
    });
});
