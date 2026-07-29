data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (official Ubuntu)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  key_name                = var.key_pair_name

  user_data = <<-EOF
              #!/bin/bash
              set -e
              apt-get update -y
              apt-get install -y docker.io docker-compose-v2 git curl
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu

              PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

              cd /home/ubuntu
              git clone https://github.com/ashwal015/DevOpsWatch.git
              cd DevOpsWatch

              cat > .env << ENVEOF
              DATABASE_URL=postgresql://postgres:${var.db_password}@db/devopswatch
              DB_PASSWORD=${var.db_password}
              SECRET_KEY=${var.secret_key}
              ALLOWED_ORIGINS=http://$${PUBLIC_IP}:3000,http://localhost:3000,http://localhost:5173
              API_URL=http://$${PUBLIC_IP}:8000
              ENVEOF

              chown -R ubuntu:ubuntu /home/ubuntu/DevOpsWatch
              docker compose up --build -d
              EOF

  tags = {
    Name = "devopswatch-app-server"
  }
}