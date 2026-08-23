import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { submitRSVP, checkAlreadySubmitted } from '../../services/index.js';
import SectionWrapper from '../ui/SectionWrapper';
import OrnamentDivider from '../ui/OrnamentDivider';
import useAnalytics, { EVENTS } from '../../hooks/useAnalytics';
import weddingConfig from '../../config/weddingConfig';
import './RSVP.css';

const buildSchema = (t, maxGuests) =>
  z.object({
    name:        z.string().min(2, t('rsvp.required')).max(60),
    phone:       z.string()
                  .optional()
                  .refine((v) => !v || /^[\d\s+-]{7,15}$/.test(v), t('rsvp.invalidPhone')),
    guestsCount: z.coerce.number().min(0).max(maxGuests, t('rsvp.guestsMax', { max: maxGuests })),
    attendance:  z.enum(['will_attend', 'wont_attend'], { required_error: t('rsvp.required') }),
    message:     z.string().optional(),
  });

const RSVP = ({ onWishesUpdated }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const groomName = isAr ? weddingConfig.groom.name : weddingConfig.groom.nameEn;
  const brideName = isAr ? weddingConfig.bride.name : weddingConfig.bride.nameEn;
  const { track } = useAnalytics();
  const [status, setStatus] = useState(
    checkAlreadySubmitted() ? 'already_submitted' : 'idle'
  );
  const [submittedAttendance, setSubmittedAttendance] = useState(null);
  const maxGuests = weddingConfig.rsvp.maxGuests || 10;

  const schema = buildSchema(t, maxGuests);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { guestsCount: 1, attendance: '', message: '' },
  });

  const attendance = watch('attendance');

  const onSubmit = async (data) => {
    track(EVENTS.RSVP_STARTED);
    try {
      await submitRSVP({
        ...data,
        language: i18n.language,
        invitationId: weddingConfig.rsvp.invitationId,
      });
      setSubmittedAttendance(data.attendance);
      setStatus('success');
      track(EVENTS.RSVP_SUBMITTED, { attendance: data.attendance });
      
      // Notify parent to refresh wishes list if available
      if (onWishesUpdated) {
        onWishesUpdated();
      }
    } catch (err) {
      if (err.message === 'already_submitted') {
        setStatus('already_submitted');
      } else {
        setStatus('error');
      }
    }
  };

  if (!weddingConfig.rsvp.enabled) return null;

  return (
    <SectionWrapper id="rsvp" alt>
      <div className="section__header">
        <h2 className="section__title font-serif">{t('rsvp.title')}</h2>
        <p className="section__subtitle">{t('rsvp.subtitle')}</p>
        <OrnamentDivider symbol="✦" />
      </div>

      <div className="rsvp-card">
        <AnimatePresence mode="wait">

          {/* Success state */}
          {status === 'success' && (
            <motion.div
              key="success"
              className="rsvp-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="rsvp-success__icon" aria-hidden="true">
                {submittedAttendance === 'will_attend' ? '🎉' : '💌'}
              </div>
              <h3 className="rsvp-success__title font-script">
                {t('rsvp.successTitle')}
              </h3>
              <p className="rsvp-success__message font-serif">
                {submittedAttendance === 'will_attend'
                  ? t('rsvp.successMessage')
                  : t('rsvp.declineMessage')}
              </p>
            </motion.div>
          )}

          {/* Already submitted */}
          {status === 'already_submitted' && (
            <motion.div
              key="already"
              className="rsvp-success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="rsvp-success__icon" aria-hidden="true">✓</div>
              <p className="rsvp-success__message font-serif">{t('rsvp.alreadySubmitted')}</p>
            </motion.div>
          )}

          {/* Form */}
          {(status === 'idle' || status === 'error') && (
            <motion.form
              key="form"
              className="rsvp-form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-name">
                  {t('rsvp.name')} <span className="form-required" aria-hidden="true">*</span>
                </label>
                <input
                  id="rsvp-name"
                  className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                  type="text"
                  placeholder={t('rsvp.namePlaceholder')}
                  autoComplete="name"
                  {...register('name')}
                />
                {errors.name && <span className="form-error" role="alert">{errors.name.message}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-phone">
                  {t('rsvp.phone')}
                </label>
                <input
                  id="rsvp-phone"
                  className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                  type="tel"
                  placeholder={t('rsvp.phonePlaceholder')}
                  autoComplete="tel"
                  {...register('phone')}
                />
                {errors.phone && <span className="form-error" role="alert">{errors.phone.message}</span>}
              </div>

              {/* Guests count */}
              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-guests">
                  {t('rsvp.guestsCount')}
                </label>
                <select
                  id="rsvp-guests"
                  className="form-input form-select"
                  {...register('guestsCount')}
                >
                  {[...Array(maxGuests + 1)].map((_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                {errors.guestsCount && (
                  <span className="form-error" role="alert">{errors.guestsCount.message}</span>
                )}
              </div>

              {/* Attendance */}
              <div className="form-group">
                <span className="form-label">{t('rsvp.attendance')} *</span>
                <div className="rsvp-radio-group radio-group">
                  <label className={`rsvp-radio ${attendance === 'will_attend' ? 'rsvp-radio--selected' : ''}`}>
                    <input
                      type="radio"
                      value="will_attend"
                      className="rsvp-radio__input"
                      {...register('attendance')}
                    />
                    <span className="rsvp-radio__icon" aria-hidden="true">✓</span>
                    <span className="rsvp-radio__text">{t('rsvp.willAttend')}</span>
                  </label>

                  <label className={`rsvp-radio ${attendance === 'wont_attend' ? 'rsvp-radio--selected rsvp-radio--decline' : ''}`}>
                    <input
                      type="radio"
                      value="wont_attend"
                      className="rsvp-radio__input"
                      {...register('attendance')}
                    />
                    <span className="rsvp-radio__icon" aria-hidden="true">✗</span>
                    <span className="rsvp-radio__text">{t('rsvp.wontAttend')}</span>
                  </label>
                </div>
                {errors.attendance && (
                  <span className="form-error" role="alert">{errors.attendance.message}</span>
                )}
              </div>

              {/* Message / Wishes */}
              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-message">
                  {t('rsvp.message')}
                </label>
                <textarea
                  id="rsvp-message"
                  className="form-input form-textarea"
                  rows={3}
                  placeholder={t('rsvp.messagePlaceholder', { groom: groomName, bride: brideName })}
                  {...register('message')}
                />
              </div>

              {/* Error banner */}
              {status === 'error' && (
                <div className="rsvp-error-banner" role="alert">
                  {t('rsvp.errorMessage')}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="rsvp-submit-btn"
                disabled={isSubmitting}
                id="btn-rsvp-submit"
              >
                {isSubmitting ? t('rsvp.submitting') : t('rsvp.submit')}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
};

export default RSVP;
