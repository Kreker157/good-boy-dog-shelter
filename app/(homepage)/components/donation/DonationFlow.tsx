'use client';

import { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { donationSchema, DonationFormValues } from './schema';
import { useSheltersQuery, useSubmitDonationMutation } from '@/lib/api/queries';
import { toContributeRequest } from './toContributeRequest';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { useDonationFlow } from './state/DonationFlowContext';
import { applyZodErrors } from '@/lib/helpers/applyZodErrors';

type Step = 1 | 2 | 3;

type StepState = {
  active: boolean;
  done: boolean;
  disabled: boolean;
};

function getStepState(
  stepIndex: Step,
  currentStep: Step,
  completed: Record<Step, boolean>,
): StepState {
  const prevDone =
    stepIndex === 1
      ? true
      : stepIndex === 2
        ? completed[1]
        : completed[1] && completed[2];

  const disabled = !prevDone;
  const done = !!completed[stepIndex];
  const active = currentStep === stepIndex;

  return { active, done, disabled };
}

const PageTitle = styled.h1`
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  color: var(--text-title);
`;

const StepperRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  margin-bottom: 48px;
`;

const StepItem = styled.button<{
  $active?: boolean;
  $done?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  background: transparent;
  border: 0;
  padding: 0;

  color: ${({ $active, $disabled }) =>
    $disabled
      ? 'var(--text-disabled)'
      : $active
        ? 'var(--text)'
        : 'var(--text-secondary)'};

  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
`;

const StepDot = styled.div<{
  $active?: boolean;
  $done?: boolean;
  $disabled?: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  display: grid;
  place-items: center;

  border: 1px solid
    ${({ $disabled, $active, $done }) =>
      $disabled
        ? 'var(--text-disabled)'
        : $active || $done
          ? 'var(--primary)'
          : 'var(--border)'};

  color: ${({ $disabled, $active, $done }) =>
    $disabled
      ? 'var(--text-disabled)'
      : $active && $done
        ? 'var(--text-secondary)'
        : $active || $done
          ? 'var(--text-primary)'
          : 'var(--text-secondary)'};

  background: ${({ $disabled, $active, $done }) =>
    $disabled
      ? 'transparent'
      : $active || $done
        ? 'var(--primary)'
        : 'transparent'};
`;

const Divider = styled.div<{
  $done?: boolean;
  $disabled?: boolean;
}>`
  height: 1px;
  flex: 1;
  background: ${({ $disabled, $done }) =>
    $disabled
      ? 'var(--text-disabled)'
      : $done
        ? 'var(--primary)'
        : 'var(--border)'};
`;

const Section = styled.div`
  margin-top: 24px;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const AmountRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-top: 48px;

  @media (max-width: 560px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const InputLabel = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--text-title);
  margin-bottom: 16px;
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 56px;
`;

const Toggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: transparent;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid var(--border);
  margin-top: 32px;
`;

const ToggleBtn = styled.button<{ $active?: boolean }>`
  height: 52px;
  border-radius: 8px;
  font-weight: 600;
  padding: 16px 8px;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'var(--primary)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--text)')};
`;

const Summary = styled.div`
  margin-top: 24px;
  width: 100%;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 16px;
`;

const SummaryLabel = styled.span`
  color: var(--text-secondary);
`;

const ErrorBox = styled.div`
  margin-top: 16px;
  padding: 12px 14px;
  border: 1px solid var(--error);
  border-radius: 12px;
  color: var(--error);
  font-size: 14px;
`;

const AmountCenter = styled.div`
  display: grid;
  place-items: center;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const AmountInputWrap = styled.div<{ $hasError?: boolean }>`
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  padding: 6px 10px 12px;
  border-bottom: 2px solid
    ${({ $hasError }) => ($hasError ? 'var(--error)' : 'var(--primary)')};
`;

const AmountInput = styled.input`
  width: 120px;
  border: 0;
  outline: none;
  background: transparent;
  text-align: center;
  font-size: 64px;
  font-weight: 600;
  color: var(--text-secondary);

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

const Euro = styled.span`
  font-size: 28px;
  color: var(--text-secondary);
  font-weight: 600;
`;

const InlineError = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: var(--error);
`;

const presetAmounts = [5, 10, 20, 30, 50, 100] as const;

export function DonationFlow() {
  const { t } = useTranslation();
  const { state, dispatch } = useDonationFlow();

  const sheltersQuery = useSheltersQuery();
  const shelters = sheltersQuery.data ?? [];
  const sheltersLoading = sheltersQuery.isLoading;

  const submitMutation = useSubmitDonationMutation();

  const defaultAmount =
    typeof state.presetAmount === 'number' ? state.presetAmount : 50;

  const [amountText, setAmountText] = useState<string>(String(defaultAmount));

  useEffect(() => {
    if (typeof state.presetAmount === 'number') {
      setAmountText(String(state.presetAmount));
    }
  }, [state.presetAmount]);

  const form = useForm<DonationFormValues>({
    defaultValues: {
      donationType: state.donationType,
      shelterId: null,
      amount: defaultAmount,
      firstName: '',
      lastName: '',
      email: '',
      phoneCountry: state.phoneCountry,
      phoneNumber: '',
      gdprConsent: false,
    },
    mode: 'onBlur',
  });

  const values = form.watch();
  const isShelterDonation = values.donationType === 'shelter';

  const helpTypeLabel = useMemo(
    () =>
      values.donationType === 'foundation'
        ? t('donation.summary.helpTypeFoundation')
        : t('donation.summary.helpTypeShelter'),
    [values.donationType, t],
  );

  function validateStep(step: Step): boolean {
    const result = donationSchema.safeParse(values);
    form.clearErrors();

    if (!result.success) {
      applyZodErrors<DonationFormValues>(result.error.issues, form.setError, t);
    }

    if (step === 1) {
      const step1 = z
        .object({
          donationType: donationSchema.shape.donationType,
          shelterId: donationSchema.shape.shelterId,
          amount: donationSchema.shape.amount,
        })
        .superRefine((val, ctx) => {
          if (val.donationType === 'shelter' && !val.shelterId) {
            ctx.addIssue({
              code: 'custom',
              path: ['shelterId'],
              message: t('errors.pickShelter'),
            });
          }
        })
        .safeParse(values);

      if (!step1.success) {
        for (const issue of step1.error.issues) {
          const path = issue.path?.[0] as keyof DonationFormValues | undefined;
          if (!path) continue;
          form.setError(path, { type: 'manual', message: issue.message });
        }
        return false;
      }
      return true;
    }

    if (step === 2) {
      const step2 = z
        .object({
          firstName: donationSchema.shape.firstName,
          lastName: donationSchema.shape.lastName,
          email: donationSchema.shape.email,
          phoneCountry: donationSchema.shape.phoneCountry,
          phoneNumber: donationSchema.shape.phoneNumber,
        })
        .safeParse(values);

      if (!step2.success) {
        for (const issue of step2.error.issues) {
          const path = issue.path?.[0] as keyof DonationFormValues | undefined;
          if (!path) continue;
          form.setError(path, { type: 'manual', message: issue.message });
        }
        return false;
      }
      return true;
    }

    return result.success;
  }

  function next() {
    const currentStep = state.step as Step;
    const ok = validateStep(currentStep);
    if (!ok) return;

    dispatch({ type: 'MARK_STEP_DONE', step: currentStep, done: true });
    dispatch({ type: 'NEXT' });

    form.clearErrors();
  }

  async function submit() {
    const ok = validateStep(3);
    if (!ok) return;

    dispatch({ type: 'MARK_STEP_DONE', step: 3, done: true });

    const body = toContributeRequest(values);

    try {
      dispatch({ type: 'SET_SUBMIT_STATUS', submitStatus: 'loading' });
      await submitMutation.mutateAsync(body);
      dispatch({ type: 'SET_SUBMIT_STATUS', submitStatus: 'success' });
      alert(t('donation.success'));
      form.reset();
      dispatch({ type: 'RESET_FLOW' });
    } catch {
      dispatch({ type: 'SET_SUBMIT_STATUS', submitStatus: 'error' });
    }
  }

  const completed = state.completed;
  const s1 = getStepState(1, state.step as Step, completed);
  const s2 = getStepState(2, state.step as Step, completed);
  const s3 = getStepState(3, state.step as Step, completed);

  const canGoTo = (target: Step) =>
    !getStepState(target, state.step as Step, completed).disabled;

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <StepperRow aria-label={t('donation.stepper.ariaLabel')}>
        <StepItem
          type="button"
          $active={s1.active}
          $done={s1.done}
          $disabled={s1.disabled}
          onClick={
            canGoTo(1) ? () => dispatch({ type: 'GOTO', step: 1 }) : undefined
          }
          aria-disabled={s1.disabled}
        >
          <StepDot $active={s1.active} $done={s1.done} $disabled={s1.disabled}>
            {s1.done ? '✓' : 1}
          </StepDot>
          {t('donation.stepper.step1')}
        </StepItem>

        <Divider $done={s1.done} $disabled={s2.disabled} />

        <StepItem
          type="button"
          $active={s2.active}
          $done={s2.done}
          $disabled={s2.disabled}
          onClick={
            canGoTo(2) ? () => dispatch({ type: 'GOTO', step: 2 }) : undefined
          }
          aria-disabled={s2.disabled}
        >
          <StepDot $active={s2.active} $done={s2.done} $disabled={s2.disabled}>
            {s2.done ? '✓' : 2}
          </StepDot>
          {t('donation.stepper.step2')}
        </StepItem>

        <Divider $done={s2.done} $disabled={s3.disabled} />

        <StepItem
          type="button"
          $active={s3.active}
          $done={s3.done}
          $disabled={s3.disabled}
          onClick={
            canGoTo(3) ? () => dispatch({ type: 'GOTO', step: 3 }) : undefined
          }
          aria-disabled={s3.disabled}
        >
          <StepDot $active={s3.active} $done={s3.done} $disabled={s3.disabled}>
            {s3.done ? '✓' : 3}
          </StepDot>
          {t('donation.stepper.step3')}
        </StepItem>
      </StepperRow>

      {state.step === 1 && (
        <>
          <PageTitle>{t('donation.step1.title')}</PageTitle>

          <Toggle role="tablist" aria-label={t('donation.step1.helpTypeAria')}>
            <ToggleBtn
              type="button"
              $active={values.donationType === 'shelter'}
              onClick={() => {
                dispatch({
                  type: 'SET_DONATION_TYPE',
                  donationType: 'shelter',
                });
                form.setValue('donationType', 'shelter', {
                  shouldValidate: true,
                });
              }}
            >
              {t('donation.step1.helpTypeShelter')}
            </ToggleBtn>

            <ToggleBtn
              type="button"
              $active={values.donationType === 'foundation'}
              onClick={() => {
                dispatch({
                  type: 'SET_DONATION_TYPE',
                  donationType: 'foundation',
                });
                form.setValue('donationType', 'foundation', {
                  shouldValidate: true,
                });
                form.setValue('shelterId', null, { shouldValidate: true });
              }}
            >
              {t('donation.step1.helpTypeFoundation')}
            </ToggleBtn>
          </Toggle>

          <Section>
            <InputLabel>{t('donation.step1.about')}</InputLabel>

            <Select
              label={t('donation.step1.shelterLabel')}
              required={isShelterDonation}
              disabled={sheltersLoading}
              value={values.shelterId ? String(values.shelterId) : ''}
              placeholder={t('donation.step1.shelterPlaceholder')}
              options={shelters.map((s) => ({
                value: String(s.id),
                label: s.name,
              }))}
              onChange={(val) => {
                form.setValue('shelterId', val ? val : null, {
                  shouldValidate: true,
                });
              }}
              error={form.formState.errors.shelterId?.message}
            />

            <Section>
              <InputLabel>{t('donation.step1.amountLabel')}</InputLabel>

              <AmountCenter>
                <AmountInputWrap $hasError={!!form.formState.errors.amount}>
                  <AmountInput
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={amountText}
                    onChange={(e) => {
                      const raw = e.target.value;

                      dispatch({
                        type: 'SET_PRESET_AMOUNT',
                        presetAmount: 'custom',
                      });

                      setAmountText(raw);

                      if (raw === '') return;

                      const n = Number(raw);
                      if (!Number.isFinite(n)) return;

                      form.setValue('amount', n, { shouldValidate: true });
                    }}
                  />
                  <Euro>€</Euro>
                </AmountInputWrap>

                {form.formState.errors.amount?.message && (
                  <InlineError>
                    {form.formState.errors.amount?.message}
                  </InlineError>
                )}
              </AmountCenter>

              <AmountRow>
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={
                      state.presetAmount === amount ? 'primary' : 'secondary'
                    }
                    size="lg"
                    onClick={() => {
                      dispatch({
                        type: 'SET_PRESET_AMOUNT',
                        presetAmount: amount,
                      });
                      form.setValue('amount', amount, { shouldValidate: true });
                      setAmountText(String(amount));
                    }}
                  >
                    {amount} €
                  </Button>
                ))}
              </AmountRow>
            </Section>
          </Section>

          <FooterRow>
            <Button
              variant="secondary"
              size="xl"
              fullWidth={false}
              type="button"
              disabled
            >
              {t('donation.actions.back')}
            </Button>
            <Button
              variant="primary"
              size="xl"
              fullWidth={false}
              type="button"
              onClick={next}
            >
              {t('donation.actions.next')} →
            </Button>
          </FooterRow>
        </>
      )}

      {state.step === 2 && (
        <>
          <PageTitle>{t('donation.step2.title')}</PageTitle>

          <Section>
            <InputLabel>{t('donation.step2.about')}</InputLabel>

            <Grid2>
              <Input
                label={t('donation.step2.firstNameLabel')}
                placeholder={t('donation.step2.firstNamePlaceholder')}
                {...form.register('firstName')}
                error={form.formState.errors.firstName?.message}
              />
              <Input
                label={t('donation.step2.lastNameLabel')}
                placeholder={t('donation.step2.lastNamePlaceholder')}
                {...form.register('lastName')}
                error={form.formState.errors.lastName?.message}
              />
            </Grid2>

            <Section>
              <Input
                label={t('donation.step2.emailLabel')}
                placeholder={t('donation.step2.emailPlaceholder')}
                type="email"
                {...form.register('email')}
                error={form.formState.errors.email?.message}
              />
            </Section>

            <Section>
              <PhoneInput
                label={t('donation.step2.phoneLabel')}
                country={values.phoneCountry}
                onCountryChange={(c) => {
                  dispatch({ type: 'SET_PHONE_COUNTRY', phoneCountry: c });
                  form.setValue('phoneCountry', c, { shouldValidate: true });
                }}
                numberValue={values.phoneNumber}
                onNumberChange={(v) =>
                  form.setValue('phoneNumber', v, { shouldValidate: true })
                }
                error={form.formState.errors.phoneNumber?.message}
              />
            </Section>
          </Section>

          <FooterRow>
            <Button
              variant="secondary"
              size="xl"
              fullWidth={false}
              type="button"
              onClick={() => dispatch({ type: 'BACK' })}
            >
              ← {t('donation.actions.back')}
            </Button>
            <Button
              variant="primary"
              size="xl"
              fullWidth={false}
              type="button"
              onClick={next}
            >
              {t('donation.actions.next')} →
            </Button>
          </FooterRow>
        </>
      )}

      {state.step === 3 && (
        <>
          <PageTitle>{t('donation.step3.title')}</PageTitle>

          <Summary>
            <SummaryRow>
              <SummaryLabel>
                {t('donation.step3.summary.helpType')}
              </SummaryLabel>
              <b>{helpTypeLabel}</b>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>{t('donation.step3.summary.shelter')}</SummaryLabel>
              <b>
                {values.shelterId
                  ? (shelters.find(
                      (s) => String(s.id) === String(values.shelterId),
                    )?.name ?? '—')
                  : '—'}
              </b>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>{t('donation.step3.summary.amount')}</SummaryLabel>
              <b>{values.amount} €</b>
            </SummaryRow>

            <Divider style={{ marginBottom: '16px', marginTop: '16px' }} />

            <SummaryRow>
              <SummaryLabel>
                {t('donation.step3.summary.fullName')}
              </SummaryLabel>
              <b>
                {[values.firstName, values.lastName]
                  .filter(Boolean)
                  .join(' ') || '—'}
              </b>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>{t('donation.step3.summary.email')}</SummaryLabel>
              <b>{values.email || '—'}</b>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>{t('donation.step3.summary.phone')}</SummaryLabel>
              <b>
                {values.phoneNumber
                  ? `${values.phoneCountry} ${values.phoneNumber}`
                  : '—'}
              </b>
            </SummaryRow>
          </Summary>

          <Divider style={{ marginBottom: '16px', marginTop: '16px' }} />

          <Section>
            <Checkbox
              label={t('donation.step3.gdprLabel')}
              checked={values.gdprConsent}
              onChange={(e) =>
                form.setValue('gdprConsent', e.target.checked, {
                  shouldValidate: true,
                })
              }
              error={form.formState.errors.gdprConsent?.message}
            />
          </Section>

          {submitMutation.isError && (
            <ErrorBox>{t('donation.errors.submitFailed')}</ErrorBox>
          )}

          <FooterRow>
            <Button
              variant="secondary"
              size="xl"
              fullWidth={false}
              type="button"
              onClick={() => dispatch({ type: 'BACK' })}
            >
              ← {t('donation.actions.back')}
            </Button>
            <Button
              variant="primary"
              size="xl"
              fullWidth={false}
              type="button"
              onClick={submit}
              disabled={submitMutation.isPending}
            >
              {t('donation.actions.submit')}
            </Button>
          </FooterRow>
        </>
      )}
    </form>
  );
}
