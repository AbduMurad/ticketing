➜ k create secret generic jwt-secret --from-literal=JWT_KEY=asdf
➜ k create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_51Jb4aZL1JqLLZK62HqXL8sx3rOKsn6SyiTsihVcR0Ys2CMm0EP4ID6f06PXCQ5iQqsjOWefSuVh6zbD7gVbnuFVP00dCijiplI

kubectl get pods --all-namespaces -l app.kubernetes.io/name=ingress-nginx --watch

#insall ngingx
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml
