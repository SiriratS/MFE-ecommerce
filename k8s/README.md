# Kubernetes Manifests for Ecommerce MFE Platform

This directory contains Kubernetes manifests for deploying the micro-frontend ecommerce platform to GKE.

## Architecture

The platform consists of three micro-frontends:

- **main-mfe**: Host/shell application (serves root `/`)
- **cart-mfe**: Cart micro-frontend (serves `/cart`)
- **profile-mfe**: Profile micro-frontend (serves `/profile`)

## Files

- `namespace.yaml`: Creates the `ecommerce` namespace
- `main-deployment.yaml`: Deployment for the main/host application
- `cart-deployment.yaml`: Deployment for the cart micro-frontend
- `profile-deployment.yaml`: Deployment for the profile micro-frontend
- `services.yaml`: Services for all three micro-frontends
- `ingress.yaml`: Ingress configuration with GCP Load Balancer
- `hpa.yaml`: Horizontal Pod Autoscaler for auto-scaling

## Prerequisites

1. GKE cluster is created and running
2. Docker images are built and pushed to Artifact Registry:
   - `asia-southeast1-docker.pkg.dev/testgke-482412/ecommerce-images/main:latest`
   - `asia-southeast1-docker.pkg.dev/testgke-482412/ecommerce-images/cart:latest`
   - `asia-southeast1-docker.pkg.dev/testgke-482412/ecommerce-images/profile:latest`
3. `kubectl` is configured to connect to your GKE cluster

## Deployment Steps

### 1. Connect to GKE Cluster

```bash
gcloud container clusters get-credentials ecommerce-cluster --zone=asia-southeast1-a
```

### 2. Create Namespace (Optional)

```bash
kubectl apply -f namespace.yaml
```

### 3. Deploy All Resources

```bash
# Deploy to default namespace
kubectl apply -f .

# Or deploy to ecommerce namespace
kubectl apply -f . -n ecommerce
```

### 4. Verify Deployments

```bash
# Check deployments
kubectl get deployments

# Check pods
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress
```

### 5. Get External IP

```bash
# Wait for external IP to be assigned (may take a few minutes)
kubectl get ingress ecommerce-ingress --watch
```

## Accessing the Application

Once the ingress has an external IP:

```bash
# Get the external IP
kubectl get ingress ecommerce-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Access your application at:

- Main app: `http://<EXTERNAL-IP>/`
- Cart: `http://<EXTERNAL-IP>/cart`
- Profile: `http://<EXTERNAL-IP>/profile`

## Updating Deployments

### Update Image Version

```bash
# Update main-mfe image
kubectl set image deployment/main-mfe main=asia-southeast1-docker.pkg.dev/testgke-482412/ecommerce-images/main:v1.0.1

# Check rollout status
kubectl rollout status deployment/main-mfe
```

### Rollback Deployment

```bash
# Rollback to previous version
kubectl rollout undo deployment/main-mfe

# Rollback to specific revision
kubectl rollout undo deployment/main-mfe --to-revision=2
```

## Scaling

### Manual Scaling

```bash
# Scale main-mfe to 3 replicas
kubectl scale deployment/main-mfe --replicas=3
```

### Auto-scaling (HPA)

```bash
# Apply HPA configuration
kubectl apply -f hpa.yaml

# Check HPA status
kubectl get hpa
```

## Monitoring

```bash
# View logs
kubectl logs -f deployment/main-mfe

# View logs for specific pod
kubectl logs -f <pod-name>

# Describe pod for troubleshooting
kubectl describe pod <pod-name>

# Get pod resource usage
kubectl top pods
```

## Cleanup

```bash
# Delete all resources
kubectl delete -f .

# Or delete specific resources
kubectl delete deployment main-mfe cart-mfe profile-mfe
kubectl delete service main-mfe-service cart-mfe-service profile-mfe-service
kubectl delete ingress ecommerce-ingress
```

## Notes

- All deployments use health checks (`/health` endpoint)
- Resource limits are set to prevent resource exhaustion
- Each MFE runs with 2 replicas for high availability
- Ingress uses GCP Load Balancer for external access
- Update the domain in `ingress.yaml` before deploying to production
