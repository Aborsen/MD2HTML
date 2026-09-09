import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GoogleGlyph } from '@/components/GoogleGlyph';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n/context';
import { Button } from '@/ui/components/Button';
import { Checkbox } from '@/ui/components/Checkbox';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ui/components/InputGroup';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/ui/components/Modal';
import { PasswordInput } from '@/ui/components/PasswordInput';
import { Separator } from '@/ui/components/Separator';
import { Typography } from '@/ui/components/Typography';

/*
 * Signing in, signing up, and asking for a reset link — one dialog, three views.
 *
 * Three views rather than three routes. Somebody who came here to convert a file is in the middle
 * of doing that: a page navigation loses the document they had open, and a dialog that switches
 * between "sign in" and "sign up" costs them nothing to change their mind in.
 *
 * Google stays on all three because it is the shortest path for anybody who has an account already,
 * and it sits below the form rather than above it: the form is what this dialog exists for now, and
 * the button that leaves the page belongs after the one that does not.
 *
 * No password rules are listed. The auth service enforces its own minimum and this app does not
 * know what it is — a list of requirements that disagrees with the server is worse than no list,
 * because it tells somebody their password is fine and then refuses it. What is shown instead is
 * whatever the service says went wrong, in its own words.
 */

type View = 'signin' | 'signup' | 'reset';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which view to open on. The header's button opens sign-in; a gate can open sign-up. */
  initial?: View;
}

export function AuthDialog({
  open,
  onOpenChange,
  initial = 'signin',
}: AuthDialogProps) {
  const t = useT();
  const {
    signIn,
    signInWithEmail,
    signUpWithEmail,
    requestPasswordReset,
    isSigningIn,
  } = useAuth();

  const [view, setView] = useState<View>(initial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  /** What went wrong, or what happened — one line under the form, either way. */
  const [said, setSaid] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  /*
   * Reopening starts clean.
   *
   * Without this, closing the dialog on a failed password and opening it again shows the old
   * refusal under an empty form, which reads as though the empty form had been refused.
   */
  useEffect(() => {
    if (open) {
      setView(initial);
      setSaid(null);
      setDone(false);
      setPassword('');
    }
  }, [open, initial]);

  const move = (next: View) => {
    setView(next);
    setSaid(null);
    setDone(false);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaid(null);

    if (view === 'reset') {
      const failed = await requestPasswordReset(email);

      setSaid(failed ?? t('auth.dialog.reset.sent'));
      setDone(!failed);

      return;
    }

    if (view === 'signup' && !accepted) {
      setSaid(t('auth.dialog.terms.required'));

      return;
    }

    const failed =
      view === 'signin'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);

    if (!failed) {
      onOpenChange(false);

      return;
    }

    setSaid(failed);
  };

  const title =
    view === 'signin'
      ? t('auth.dialog.signin.title')
      : view === 'signup'
        ? t('auth.dialog.signup.title')
        : t('auth.dialog.reset.title');

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="sm:max-w-[26rem]">
        <ModalHeader align="center">
          <ModalTitle>{title}</ModalTitle>
          {view === 'reset' && (
            <Typography variant="p" textColor="secondary" className="text-sm">
              {t('auth.dialog.reset.lede')}
            </Typography>
          )}
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          <form className="flex flex-col gap-3" onSubmit={submit}>
            {/*
              * An InputGroup, not a bare `Input`.
              *
              * `Input` in this design system is transparent and borderless — it is the field
              * inside a group, not a field on its own — so on its own it rendered the placeholder
              * as loose text with no box around it, beside a password field that looked right.
              */}
            <InputGroup>
              <InputGroupAddon>
                <Mail className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                type="email"
                required
                autoComplete="email"
                placeholder={t('auth.dialog.email')}
                aria-label={t('auth.dialog.email')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </InputGroup>

            {view !== 'reset' && (
              <PasswordInput
                required
                /*
                 * The browser needs telling which one this is: `current-password` on a sign-in and
                 * `new-password` on a sign-up, or a password manager offers the wrong thing and
                 * saves the wrong thing.
                 */
                autoComplete={
                  view === 'signin' ? 'current-password' : 'new-password'
                }
                placeholder={t('auth.dialog.password')}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            )}

            {view === 'signin' && (
              <button
                type="button"
                className="self-start rounded text-brand-tertiary text-xs hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand"
                onClick={() => move('reset')}
              >
                {t('auth.dialog.forgot')}
              </button>
            )}

            {view === 'signup' && (
              <label className="flex items-center gap-2 text-ink-secondary text-xs">
                <Checkbox
                  checked={accepted}
                  onCheckedChange={(value) => setAccepted(value === true)}
                />
                {/* One sentence with the link dropped into it, so it can be reordered. */}
                {t('auth.dialog.terms').split('{terms}').map((piece, index) => (
                  <span key={index}>
                    {piece}
                    {index === 0 && (
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-tertiary hover:underline"
                      >
                        {t('auth.dialog.terms.link')}
                      </a>
                    )}
                  </span>
                ))}
              </label>
            )}

            {said && (
              <Typography
                variant="p"
                className={
                  done ? 'text-ink-secondary text-xs' : 'text-danger text-xs'
                }
                role={done ? 'status' : 'alert'}
              >
                {said}
              </Typography>
            )}

            <Button type="submit" fullWidth isLoading={isSigningIn}>
              {view === 'signin'
                ? t('auth.dialog.submit.signin')
                : view === 'signup'
                  ? t('auth.dialog.submit.signup')
                  : t('auth.dialog.submit.reset')}
            </Button>
          </form>

          {view === 'reset' ? (
            <button
              type="button"
              className="self-center rounded text-brand-tertiary text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand"
              onClick={() => move('signin')}
            >
              {t('auth.dialog.back')}
            </button>
          ) : (
            <Typography
              variant="p"
              textColor="secondary"
              className="text-center text-sm"
            >
              {view === 'signin'
                ? t('auth.dialog.tonew')
                : t('auth.dialog.toexisting')}{' '}
              <button
                type="button"
                className="rounded text-brand-tertiary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand"
                onClick={() => move(view === 'signin' ? 'signup' : 'signin')}
              >
                {view === 'signin'
                  ? t('auth.dialog.tonew.action')
                  : t('auth.dialog.toexisting.action')}
              </button>
            </Typography>
          )}

          {view !== 'reset' && (
            <>
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <Typography
                  variant="span"
                  textColor="light"
                  className="text-xs uppercase tracking-wide"
                >
                  {t('auth.dialog.or')}
                </Typography>
                <Separator className="flex-1" />
              </div>

              <Button
                type="button"
                variant="secondary"
                fullWidth
                leftSlot={<GoogleGlyph aria-hidden className="size-4" />}
                onClick={() => void signIn()}
              >
                {t('auth.dialog.google')}
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
