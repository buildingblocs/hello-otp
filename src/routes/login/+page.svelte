<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import * as InputOTP from "$lib/components/ui/input-otp/index.js";
    import {authClient} from "$lib/auth-client"
    import '../layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Spinner } from "$lib/components/ui/spinner/index.js";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";

    // states
    let sent = $state(false);
    let loading = $state(false);
    let error = $state("");

    // user values
    let email = $state("");
    let otp = $state("");

    $effect(() => {
        if (otp.length === 6) {
            verifyOtp();
        }
    });

    async function sendOtp(resend: boolean) {
        loading = true
        email = email.toLowerCase()
        error = ""
        const { error: err } = await authClient.emailOtp.sendVerificationOtp({
            email,
            type: "sign-in",
        });
        loading = false

        if (err) {
            error = err.message ?? "Failed to send verification code";
            return;
        }

        sent = true;
        if (resend) {
            toast.success(`Code has been resent to ${email}`)
        }
    }

    async function verifyOtp() {
        loading = true
        error = ""
        if (otp.length !== 6) {
            error = "Verification code is less than six digits"
            loading = false
            return;
        }
        const { error: err } = await authClient.signIn.emailOtp({
            email: email, // required
            otp: otp, // required
        });
        loading = false

        if (err) {
            error = err.message ?? "Failed to verify verification code";
            return;
        }

        toast.success("Logged in")
        await goto("/app");
    }
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex flex-col gap-8 items-center justify-center h-screen max-w-sm mx-auto">
    <Card.Root class="-my-4 w-full">
        <Card.Header>
            <Card.Title>Login to hello-otp</Card.Title>
            <Card.Description>
                {#if sent}
                    Enter the code sent to {email} <br>
                    Did not receive the code? <Button variant="ghost" class="link hover:bg-white/0 -my-3 -mx-3" onclick={() => sendOtp(true)}>Resend</Button>
                {:else}
                    Enter your email below and receive a verification code to login
                {/if}
            </Card.Description>
        </Card.Header>
        <Card.Content class="flex items-center justify-center">
            {#if sent}
                <InputOTP.Root maxlength={6} bind:value={otp}>
                    {#snippet children({ cells })}
                        <InputOTP.Group>
                            {#each cells.slice(0, 3) as cell (cell)}
                                <InputOTP.Slot {cell} />
                            {/each}
                        </InputOTP.Group>
                        <InputOTP.Separator />
                        <InputOTP.Group>
                            {#each cells.slice(3, 6) as cell (cell)}
                                <InputOTP.Slot {cell} />
                            {/each}
                        </InputOTP.Group>
                    {/snippet}
                </InputOTP.Root>
            {:else}
                <div class="flex flex-col gap-6 w-full">
                    <div class="grid gap-2 w-full">
                        <Label for="email">Email</Label>
                        <Input autocomplete="email" onkeydown={(e) => { if (e.key === "Enter") sendOtp(false); }} bind:value={email} type="email" placeholder="m@example.com" required />
                    </div>
                </div>
            {/if}
        </Card.Content>
        <Card.Footer class="gap-2">
            {#if loading}
                <Button class="w-full" disabled>
                    <Spinner />
                    Loading...
                </Button>
            {:else if sent}
                <Button onclick={() => { sent = false; email = ""; otp = ""; }} class="flex-1" variant="secondary">
                    Back
                </Button>
                <Button onclick={verifyOtp} class="flex-1">
                    Login
                </Button>
            {:else}
                <Button onclick={() => sendOtp(false)} class="w-full">
                    Login
                </Button>
            {/if}
        </Card.Footer>
    </Card.Root>

    {#if error}
        <Alert.Root variant="destructive">
            <Alert.Title>Authentication Error</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
    {/if}
</div>