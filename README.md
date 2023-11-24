# NEWS BOULEVARD NODEJS API PROJECT


## Connect to the server via SSH:
`chmod 400 newsboulevard-server-key.pem`
`ssh -i "newsboulevard-server-key.pem" ubuntu@ec2-44-215-246-142.compute-1.amazonaws.com`

## Provision the virtual machine with ansible
```
cd ansible
ansible-playbook -i inventory.ini ec2_provision.yml
```

## Start the github runner in daemon
`sudo ./svc.sh install`
`sudo ./svc.sh start`