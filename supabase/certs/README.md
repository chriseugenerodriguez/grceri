# Database TLS certificate

`prod-ca-2021.crt` is the public Supabase Root 2021 CA certificate downloaded from:

https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt

It is a public certificate, not a private key. The database CLI uses it to verify the pooler's TLS certificate and hostname. Its current validity ends April 26, 2031; replace it through Supabase's database SSL configuration when the provider rotates the CA. See [Supabase SSL enforcement](https://supabase.com/docs/guides/platform/ssl-enforcement).
