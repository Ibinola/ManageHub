'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Card } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';

// Note: metadata must live in a separate layout.ts/page metadata export
// since this is a 'use client' component. Move to a parent layout if needed.

const SettingsSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
  emailNotifications: z.boolean(),
  inAppNotifications: z.boolean(),
  language: z.string(),
  theme: z.enum(['light', 'dark']),
});

type SettingsFormValues = z.infer<typeof SettingsSchema>;

const mockUserSettings: SettingsFormValues = {
  currentPassword: '',
  newPassword: '',
  emailNotifications: true,
  inAppNotifications: true,
  language: 'en',
  theme: 'light',
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: mockUserSettings,
  });

  useEffect(() => {
    reset(mockUserSettings);
  }, [reset]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">User Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Account Settings */}
        <Card title="Account Settings">
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              {...register('currentPassword')}
              error={errors.currentPassword?.message}
            />
            <Input
              label="New Password"
              type="password"
              {...register('newPassword')}
              error={errors.newPassword?.message}
            />
          </div>
        </Card>

        {/* Notifications */}
        <Card title="Notifications">
          <p className="text-sm text-gray-500 mb-4">
            Manage how and where you receive notifications.
          </p>
          <div className="space-y-4">
            <Controller
              control={control}
              name="emailNotifications"
              render={({ field: { value, onChange } }) => (
                <Switch
                  label="Email Notifications"
                  description="Receive updates and alerts via email."
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="inAppNotifications"
              render={({ field: { value, onChange } }) => (
                <Switch
                  label="In-App Notifications"
                  description="See notifications inside the application."
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
          </div>
        </Card>

        {/* Preferences */}
        <Card title="Preferences">
          <div className="space-y-4">
            <Select
              label="Language"
              {...register('language')}
              options={[
                { label: 'English', value: 'en' },
                { label: 'Spanish', value: 'es' },
              ]}
              defaultValue={mockUserSettings.language}
            />
            <Select
              label="Theme"
              {...register('theme')}
              options={[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ]}
              defaultValue={mockUserSettings.theme}
            />
          </div>
        </Card>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}