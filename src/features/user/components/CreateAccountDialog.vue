<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Eye, EyeOff, RefreshCw, Copy, Check, UserPlus } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Role = 'admin' | 'editor' | 'user'
type Status = 'active' | 'inactive' | 'suspended'

export interface CreateAccountPayload {
  username: string
  email: string
  password: string
  role: Role
  status: Status
  mustChangePassword: boolean
}

const emit = defineEmits<{
  (e: 'submit', payload: CreateAccountPayload): void
}>()

const open = ref(false)
const showPassword = ref(false)
const copied = ref(false)
const submitting = ref(false)
const submitted = ref(false)

const form = reactive<CreateAccountPayload>({
  username: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active',
  mustChangePassword: true,
})

const errors = computed(() => {
  const e: Partial<Record<keyof CreateAccountPayload, string>> = {}
  if (!/^[a-zA-Z0-9_.]{3,20}$/.test(form.username))
    e.username = 'Username 3–20 karakter (huruf, angka, _ atau .)'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = 'Format email tidak valid'
  if (form.password.length < 12)
    e.password = 'Password minimal 12 karakter'
  else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/\d/.test(form.password))
    e.password = 'Harus mengandung huruf besar, huruf kecil, dan angka'
  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

function generatePassword(length = 16) {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
  const values = crypto.getRandomValues(new Uint32Array(length))
  let pwd = Array.from(values, v => charset[v % charset.length]).join('')
  // pastikan memenuhi aturan kompleksitas
  if (!/[a-z]/.test(pwd) || !/[A-Z]/.test(pwd) || !/\d/.test(pwd))
    return generatePassword(length)
  form.password = pwd
  showPassword.value = true
  copied.value = false
}

async function copyPassword() {
  if (!form.password) return
  await navigator.clipboard.writeText(form.password)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function reset() {
  Object.assign(form, {
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
    mustChangePassword: true,
  })
  showPassword.value = false
  submitted.value = false
}

async function onSubmit() {
  submitted.value = true
  if (!isValid.value) return
  submitting.value = true
  try {
    emit('submit', { ...form })
    open.value = false
    reset()
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open" @update:open="(v: boolean) => !v && reset()">
    <DialogTrigger as-child>
      <Button>
        <UserPlus class="mr-2 size-4" />
        Create Account
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-md">
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Buat akun baru untuk pengguna. Pengguna dapat mengganti password setelah login.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup class="py-4">
          <Field>
            <FieldLabel for="ca-username">Username</FieldLabel>
            <Input
              id="ca-username"
              v-model="form.username"
              placeholder="johndoe"
              autocomplete="off"
              required
            />
            <FieldError v-if="submitted && errors.username">
              {{ errors.username }}
            </FieldError>
          </Field>

          <Field>
            <FieldLabel for="ca-email">Email</FieldLabel>
            <Input
              id="ca-email"
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              autocomplete="off"
              required
            />
            <FieldError v-if="submitted && errors.email">
              {{ errors.email }}
            </FieldError>
          </Field>

          <Field>
            <FieldLabel for="ca-password">Password</FieldLabel>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <Input
                  id="ca-password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Min. 12 karakter"
                  autocomplete="new-password"
                  class="pr-10"
                  required
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                  :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                  @click="showPassword = !showPassword"
                >
                  <EyeOff v-if="showPassword" class="size-4" />
                  <Eye v-else class="size-4" />
                </button>
              </div>
              <Button type="button" variant="outline" size="icon" title="Generate password" @click="generatePassword()">
                <RefreshCw class="size-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" title="Salin password" :disabled="!form.password" @click="copyPassword">
                <Check v-if="copied" class="size-4" />
                <Copy v-else class="size-4" />
              </Button>
            </div>
            <FieldDescription>
              Gunakan tombol generate untuk membuat password acak yang kuat.
            </FieldDescription>
            <FieldError v-if="submitted && errors.password">
              {{ errors.password }}
            </FieldError>
          </Field>

          <div class="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel for="ca-role">Role</FieldLabel>
              <Select v-model="form.role">
                <SelectTrigger id="ca-role">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel for="ca-status">Status</FieldLabel>
              <Select v-model="form.status">
                <SelectTrigger id="ca-status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field orientation="horizontal">
            <Checkbox id="ca-must-change" v-model="form.mustChangePassword" />
            <FieldLabel for="ca-must-change" class="font-normal">
              Wajibkan pengguna mengganti password saat login pertama
            </FieldLabel>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">
            Cancel
          </Button>
          <Button type="submit" :disabled="submitting">
            Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>