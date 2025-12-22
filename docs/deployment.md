# Deployment

## Build Process

```bash
npm run build
```

This creates an optimized production build in `.next/`.

## Deployment Options

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to `master`

### Firebase App Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Pre-Deployment Checklist

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No lint errors: `npm run lint`
- [ ] Environment variables configured
- [ ] Asset CDN configured (or MinIO deployed)

## Asset Deployment

For production, frame assets need a CDN or hosted MinIO:

1. Deploy MinIO to cloud provider (or use S3)
2. Upload optimized frames from `docs/media-assets-optimized/`
3. Configure Nginx or CDN for caching
4. Update `NEXT_PUBLIC_ASSET_BASE_URL`

## Monitoring

- **Performance**: Core Web Vitals via Vercel Analytics or Lighthouse
- **Errors**: Browser console, Vercel logs
- **Assets**: CDN cache hit rates

## Rollback

Vercel provides instant rollback to previous deployments via dashboard.

For manual rollback:

```bash
git revert HEAD
git push origin master
```
