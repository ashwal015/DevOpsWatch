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
              apt-get update -y
              apt-get install -y docker.io docker-compose-plugin git
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "devopswatch-app-server"
  }
}