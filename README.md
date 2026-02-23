# Comprehensive CI/CD Pipeline Setup Guide

This document provides a detailed, step-by-step guide to setting up a Continuous Integration/Continuous Deployment (CI/CD) pipeline, covering essential tools and configurations. It's designed to be accessible for beginners while offering insights for intermediate and advanced users.

## 1. Overview of Components

Before diving into the setup, let's understand the core components involved in this CI/CD pipeline. Each component plays a crucial role in automating the software development lifecycle.

| Component   | Purpose                                     | Default Port |
| :---------- | :------------------------------------------ | :----------- |
| **Docker**  | Container runtime, packaging applications   | —            |
| **Jenkins** | CI/CD automation server                     | 8080         |
| **SonarQube** | Code quality and security analysis          | 9000         |
| **MSSQL**   | Relational database management system       | 1433         |
| **Node API**| Backend service (e.g., REST API)            | 5000         |
| **React**   | Frontend web application framework          | 3000         |

### Explanation for Beginners:

*   **Docker:** Imagine Docker as a magical box that can hold your entire application and all its dependencies. This box (called a **container**) can then be easily moved and run on any computer, ensuring your application works the same everywhere. It solves the classic 
"`it works on my machine`" problem.
*   **Jenkins:** Think of Jenkins as the orchestrator of your development process. It automates tasks like building your code, running tests, and deploying your application whenever you make changes. It's like having a tireless assistant for your software project.
*   **SonarQube:** This is your code's quality control expert. SonarQube automatically scans your code for bugs, vulnerabilities, and code smells, helping you write cleaner, more secure, and maintainable software.
*   **MSSQL:** This is where your application stores its data. It's a powerful database system used for managing structured information.
*   **Node API:** This is the "brain" of your application, handling requests from the frontend, processing data, and interacting with the database. It's the server-side logic.
*   **React:** This is what users see and interact with in their web browser. React helps build dynamic and responsive user interfaces.

## 2. Docker Installation and Basic Usage

Docker is fundamental for modern CI/CD pipelines, enabling consistent environments from development to production. This section guides you through its installation and essential commands.

### Installation Steps:

1.  **Update your package list:**
    ```bash
    sudo apt update
    ```
    *   **Beginner Explanation:** This command refreshes the list of available software packages from the internet, ensuring you get the latest versions.

2.  **Install Docker Engine and Docker Compose:**
    ```bash
    sudo apt install docker.io docker-compose -y
    ```
    *   **Beginner Explanation:** `docker.io` is the main Docker program, and `docker-compose` is a tool to manage multiple Docker containers together. The `-y` flag automatically confirms any prompts during installation.

3.  **Add your user to the `docker` group:**
    ```bash
    sudo usermod -aG docker $USER && newgrp docker
    ```
    *   **Beginner Explanation:** By default, only the `root` user can run Docker commands. This command adds your current user (`$USER`) to the `docker` group, allowing you to run Docker commands without `sudo`. `newgrp docker` applies the changes immediately to your current session.
    *   **Advanced Note:** For security reasons, adding users to the `docker` group grants them root-level privileges. Be mindful of who has access to this group in production environments.

4.  **Check Docker service status:**
    ```bash
    systemctl status docker
    ```
    *   **Beginner Explanation:** This command checks if the Docker service is running correctly on your system. You should see an "active (running)" status.

5.  **Verify Docker and Docker Compose versions:**
    ```bash
    docker --version
    docker-compose version
    ```
    *   **Beginner Explanation:** These commands confirm that Docker and Docker Compose are installed and show their respective versions.

### Essential Docker Commands:

*   **List all containers (running and stopped):**
    ```bash
    docker ps -a
    ```
    *   **Beginner Explanation:** This command shows you all Docker containers on your system, including those that are currently running and those that have stopped.

*   **List all Docker images:**
    ```bash
    docker images -a
    ```
    *   **Beginner Explanation:** This command displays all Docker images that are stored locally on your machine. Images are like blueprints for creating containers.

*   **Run a test container (hello-world):**
    ```bash
    docker run hello-world
    ```
    *   **Beginner Explanation:** This command downloads and runs a tiny "hello-world" container, which simply prints a message and exits. It's a great way to verify your Docker installation is working.

*   **Run an Nginx web server in detached mode:**
    ```bash
    docker run -d -p 8081:80 --name my-web-server nginx
    ```
    *   **Beginner Explanation:** This command does a few things:
        *   `-d`: Runs the container in **detached mode** (in the background).
        *   `-p 8081:80`: **Port mapping**. It maps port `8081` on your host machine to port `80` inside the container. This means you can access the Nginx web server by going to `http://localhost:8081` in your browser.
        *   `--name my-web-server`: Assigns a human-readable name to your container, making it easier to manage.
        *   `nginx`: Specifies the Docker image to use (the official Nginx web server image).
    *   **Advanced Note:** Port mapping is crucial for making services running inside containers accessible from outside. Ensure no port conflicts exist on your host machine.

*   **Stop a running container:**
    ```bash
    docker stop my-web-server
    ```
    *   **Beginner Explanation:** This command gracefully stops the container named `my-web-server`.

*   **Remove a stopped container:**
    ```bash
    docker rm my-web-server
    ```
    *   **Beginner Explanation:** This command removes the container named `my-web-server` from your system. You can only remove stopped containers.

## 3. Java Installation (Prerequisite for Jenkins)

Jenkins, a key component of our CI/CD pipeline, requires Java to run. This section details the installation of OpenJDK.

### Installation Steps:

1.  **Update your package list:**
    ```bash
    sudo apt update
    ```
    *   **Beginner Explanation:** Same as before, this refreshes your software package list.

2.  **Install OpenJDK 21 JRE:**
    ```bash
    sudo apt install fontconfig openjdk-21-jre
    ```
    *   **Beginner Explanation:** `openjdk-21-jre` is the Java Runtime Environment version 21, which is necessary to run Java applications like Jenkins. `fontconfig` is a dependency often needed for graphical Java applications.

3.  **Verify Java installation:**
    ```bash
    java -version
    ```
    *   **Beginner Explanation:** This command checks if Java is installed correctly and displays its version. You should see output indicating OpenJDK version 21.

## 4. Jenkins Installation and Configuration

Jenkins is the heart of our CI/CD process, automating builds, tests, and deployments. This section covers its installation and initial setup.

### Installation Steps:

1.  **Download the Jenkins GPG key:**
    ```bash
    sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
    ```
    *   **Beginner Explanation:** This command downloads a security key (GPG key) that is used to verify the authenticity of Jenkins packages. This ensures that the software you download is legitimate and hasn't been tampered with.

2.  **Add the Jenkins repository to your system's sources:**
    ```bash
    echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
    ```
    *   **Beginner Explanation:** This command adds the official Jenkins software repository to your system's list of sources. This tells your system where to find Jenkins packages for installation.

3.  **Update your package list again:**
    ```bash
    sudo apt update
    ```
    *   **Beginner Explanation:** After adding a new repository, you need to update your package list so your system knows about the newly available Jenkins packages.

4.  **Install Jenkins:**
    ```bash
    sudo apt install jenkins -y
    ```

4.  **Enable and start the Jenkins service:**
    ```bash
    sudo systemctl enable jenkins
    sudo systemctl start jenkins
    ```
    *   **Beginner Explanation:** `enable jenkins` configures Jenkins to start automatically when your system boots up. `start jenkins` immediately starts the Jenkins service.

5.  **Check Jenkins service status:**
    ```bash
    sudo systemctl status jenkins
    ```
    *   **Beginner Explanation:** Verify that Jenkins is running. You should see an "active (running)" status.

6.  **Add Jenkins user to the `docker` group:**
    ```bash
    sudo usermod -aG docker jenkins
    sudo systemctl restart jenkins
    ```
    *   **Beginner Explanation:** This is crucial! Jenkins will often need to interact with Docker (e.g., to build Docker images or run tests in containers). By adding the `jenkins` user to the `docker` group, you grant Jenkins the necessary permissions to execute Docker commands. Restarting Jenkins applies these changes.
    *   **Advanced Note:** In production, consider more granular permissions or using Docker-in-Docker (DinD) for Jenkins agents to isolate the Docker daemon.

7.  **Retrieve the initial Admin Password:**
    ```bash
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
    ```
    *   **Beginner Explanation:** After Jenkins starts for the first time, it generates a temporary administrator password. This command displays that password, which you'll need to unlock Jenkins in your web browser.

8.  **After install successfully:**
    ```bash
    http://localhost:8080
    ```
    *   **Beginner Explanation:** Once the service is active, Jenkins usually runs on port 8080. You can access it by opening your browser and going to http://localhost:8080.


### Post-Installation: Installing Jenkins Plugins

Jenkins' functionality can be extended through plugins. After accessing Jenkins in your browser (typically `http://YOUR_SERVER_IP:8080`), you'll be prompted to install plugins. Select the suggested plugins or manually install the following:

*   **Docker Pipeline:** Enables Jenkins to build and run Docker containers as part of your pipeline.
*   **Docker Commons Plugin:** Provides common Docker utilities for Jenkins.
*   **GitHub Integration Plugin:** Facilitates integration with GitHub repositories, including webhooks for automatic build triggers.
*   **SonarQube Scanner:** Allows Jenkins to trigger SonarQube analyses of your code.
*   **NodeJS Plugin:** Enables Jenkins to use Node.js and npm for projects that require them.

## 5. SonarQube Setup

SonarQube is a critical tool for maintaining code quality and identifying security vulnerabilities. For simplicity, we'll run SonarQube as a Docker container.

### Running SonarQube with Docker:

1.  **Start SonarQube container:**
    ```bash
    docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community
    ```
    *   **Beginner Explanation:** This command starts a SonarQube container:
        *   `-d`: Runs in detached (background) mode.
        *   `--name sonarqube`: Names the container `sonarqube`.
        *   `-p 9000:9000`: Maps port `9000` on your host to port `9000` inside the container. You'll access SonarQube via `http://YOUR_SERVER_IP:9000`.
        *   `sonarqube:lts-community`: Uses the Long Term Support (LTS) community edition of SonarQube.
    *   **Advanced Note:** For production deployments, consider using a dedicated database (like PostgreSQL) instead of the embedded H2 database, and persistent volumes for data storage.

2.  **Access SonarQube Web UI:**
    Open your web browser and navigate to `http://YOUR_SERVER_IP:9000`.
    *   **Default Login:** `admin` / `admin` (you will be prompted to change this password upon first login).

### Integrating SonarQube with Jenkins:

To allow Jenkins to interact with SonarQube, you need to generate an authentication token in SonarQube and configure it in Jenkins.

#### (a) Generate a Token for Jenkins in SonarQube:

1.  Log in to SonarQube.
2.  Go to **My Account → Security → Generate Token**.
3.  **Name:** `jenkins-token` (or any descriptive name).
4.  **Type:** `Global Analysis Token`.
5.  Click **Generate** and **copy the token immediately**. This token is shown only once! (Example: `sqa_dbdec3e7924381623b9a6f516eef3d53c062582e`)
    *   **Beginner Explanation:** This token acts like a password that Jenkins will use to securely communicate with SonarQube and submit code analysis results.

#### (b) Add SonarQube Token to Jenkins Credentials:

1.  In Jenkins, navigate to **Manage Jenkins → Credentials → System → Global credentials (unrestricted)**.
2.  Click **Add Credentials**.
3.  **Kind:** Select `Secret text`.
4.  **Secret:** Paste the copied SonarQube token here.
5.  **ID:** `sonarqube-token` (or a unique identifier).
6.  **Description:** (Optional) `SonarQube token for Jenkins integration`.
7.  Click **Create**.
    *   **Beginner Explanation:** You're securely storing the SonarQube token within Jenkins so that Jenkins jobs can use it without exposing the token directly in scripts.

#### (c) Configure SonarQube Server in Jenkins:

1.  In Jenkins, navigate to **Manage Jenkins → System → SonarQube servers**.
2.  Click **Add SonarQube server**.
3.  **Name:** `SonarQube` (or a descriptive name).
4.  **Server URL:** `http://YOUR_IP:9000` (Replace `YOUR_IP` with the actual IP address of your server where SonarQube is running).
5.  **Authentication Token:** Select `sonarqube-token` from the dropdown (this is the credential you just added).
6.  Click **Save**.
    *   **Beginner Explanation:** This step tells Jenkins where your SonarQube server is located and which credentials to use when connecting to it.

## 6. Install ngrok (for exposing local services)

`ngrok` is a powerful tool that creates secure tunnels from a public endpoint to a locally running web service. This is particularly useful for exposing your local Jenkins instance to external services like GitHub webhooks.

### Installation Steps:

1.  **Download ngrok GPG key:**
    ```bash
    curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
      sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
    ```
    *   **Beginner Explanation:** Similar to Jenkins, this downloads a security key to verify ngrok packages.

2.  **Add ngrok repository:**
    ```bash
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
      sudo tee /etc/apt/sources.list.d/ngrok.list
    ```
    *   **Beginner Explanation:** Adds the ngrok software repository to your system.

3.  **Update package list and install ngrok:**
    ```bash
    sudo apt update && sudo apt install -y ngrok
    ```
    *   **Beginner Explanation:** Updates package lists and then installs ngrok.

### (a) Authenticate ngrok:

To use ngrok, you need to authenticate it with your ngrok account.

1.  **Sign up at ngrok.com:** Go to `https://ngrok.com` and create a free account.
2.  **Get your Authtoken:** After signing up, go to your Dashboard (`https://dashboard.ngrok.com/get-started/your-authtoken`) and copy your authtoken.
3.  **Add Authtoken to ngrok:**
    ```bash
    ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
    ```
    *   **Beginner Explanation:** This command saves your unique authentication token to ngrok's configuration, allowing it to create secure tunnels under your account.

4.  **Expose Jenkins (or any local service):**
    ```bash
    ngrok http 8080
    ```
    *   **Beginner Explanation:** This command starts an ngrok tunnel, exposing your local service running on port `8080` (where Jenkins is running) to the internet. ngrok will provide you with a public URL (e.g., `https://shaneka-plummier-untreacherously.ngrok-free.dev`) that forwards traffic to your local Jenkins instance.
    *   **Advanced Note:** The public URL provided by ngrok is temporary for free accounts. For persistent URLs, consider a paid ngrok plan or alternative solutions like a reverse proxy with a custom domain.

## 7. GitHub Repository Setup

This section covers the initial setup of your GitHub repository and connecting it to your local project.

### Suggested GitHub Repo Name: `todo-cicd-pipeline`

1.  **Initialize a new Git repository and add a README:**
    ```bash
    echo "# todo-cicd-pipeline" >> README.md
    git init
    git add README.md
    git commit -m "first commit"
    ```
    *   **Beginner Explanation:** These commands create a new Git repository in your current directory, add a `README.md` file with a title, and commit it as the "first commit". Git is a version control system that tracks changes in your code.

2.  **Set the main branch and link to GitHub:**
    ```bash
    git branch -M main
    git remote add origin https://github.com/furkanGitId/todo-cicd-pipeline.git
    git push -u origin main
    ```
    *   **Beginner Explanation:**
        *   `git branch -M main`: Renames your default branch to `main` (a common practice).
        *   `git remote add origin ...`: Connects your local repository to a remote repository on GitHub. `origin` is the conventional name for the primary remote.
        *   `git push -u origin main`: Pushes your local `main` branch to the `origin` (GitHub) and sets it as the upstream branch, so future `git push` commands are simpler.

### (a) Set up GitHub Webhook:

GitHub webhooks are essential for triggering Jenkins builds automatically whenever changes are pushed to your repository.

1.  **Navigate to your GitHub repository settings:**
    `GitHub repo → Settings → Webhooks → Add webhook`

2.  **Configure the webhook:**
    *   **Payload URL:** `https://YOUR-NGROK-URL/github-webhook/` (Replace `YOUR-NGROK-URL` with the public URL provided by ngrok for your Jenkins instance).
    *   **Content type:** `application/json`
    *   **Which events would you like to trigger this webhook?** Select `Push events` and `Pull request events`.
    *   **Active:** Ensure this checkbox is selected.
    *   Click **Add webhook**.
    *   **Beginner Explanation:** This tells GitHub to send a notification (a "webhook") to your Jenkins server (via the ngrok URL) whenever someone pushes new code or opens a pull request. Jenkins will then use this notification to trigger a CI/CD pipeline run.

## 8. Create the Jenkins Pipeline Job

Now, let's configure Jenkins to run your CI/CD pipeline based on the code in your GitHub repository.

1.  **Create a new Jenkins item:**
    `Jenkins → New Item → Name: todo-cicd-pipeline → Select "Pipeline" → OK`

2.  **Configure General settings:**
    *   Check `GitHub project` and paste your repository URL (e.g., `https://github.com/furkanGitId/todo-cicd-pipeline.git`).

3.  **Configure Build Triggers:**
    *   Check `GitHub hook trigger for GITScm polling`.
    *   **Beginner Explanation:** This setting tells Jenkins to listen for the webhooks sent by GitHub, which will automatically start a build whenever changes are pushed.

4.  **Configure Pipeline settings:**
    *   **Definition:** Select `Pipeline script from SCM`.
    *   **SCM:** Select `Git`.
    *   **Repository URL:** Enter your GitHub repository URL.
    *   **Credentials:** If your repository is private, you'll need to add GitHub credentials here (see section 11 for PAT setup).
    *   **Branches to build:** `*/main` (This tells Jenkins to build the `main` branch).
    *   **Script Path:** `Jenkinsfile` (This is the name of the file in your repository that contains your pipeline definition).
    *   Click **Save**.
    *   **Beginner Explanation:** This section tells Jenkins where to find your code and, more importantly, where to find the `Jenkinsfile`. The `Jenkinsfile` is a special file in your repository that defines all the steps of your CI/CD pipeline (e.g., build, test, deploy).

## 9. Configure SonarQube Scanner in Jenkins

This step ensures that Jenkins knows how to use the SonarQube Scanner for code analysis within your pipelines.

1.  **Navigate to Global Tool Configuration:**
    `Manage Jenkins → Global Tool Configuration → SonarQube Scanner`.
2.  **Add SonarQube Scanner:** Click `Add SonarQube Scanner` and configure it (e.g., name it `Default SonarQube Scanner`). You might need to specify the installation directory if it's not automatically detected.
    *   **Beginner Explanation:** This tells Jenkins where the SonarQube Scanner executable is located on your system, allowing your pipeline to invoke it for code analysis.

## 10. Node.js Installation (if not already present)

If your project (e.g., the React frontend or Node API) requires Node.js, ensure it's installed and accessible to Jenkins.

### Installation Steps:

1.  **Remove incomplete Node.js 18 installation (if any):**
    ```bash
    sudo apt-get remove -y nodejs
    ```
    *   **Beginner Explanation:** If you have a partially installed or older version of Node.js, this command removes it to prevent conflicts.

2.  **Install Node.js 22 via NodeSource:**
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
    *   **Beginner Explanation:** This is the recommended way to install Node.js. The first command adds the NodeSource repository, and the second command installs Node.js version 22 and its package manager, npm.

3.  **Verify Node.js and npm for Jenkins user:**
    ```bash
    sudo -u jenkins node -v    # should print v22.x.x
    sudo -u jenkins npm -v     # should now work
    ```
    *   **Beginner Explanation:** It's crucial to verify that the `jenkins` user can execute Node.js and npm commands, as Jenkins pipelines run under this user. This ensures your Node.js-dependent build steps will work correctly.

## 11. Granting Jenkins Sudo Permissions (Specific Use Case)

In some scenarios, Jenkins might need to execute commands that require `sudo` privileges, such as interacting with Docker. This step grants specific, limited `sudo` access to the Jenkins user.

1.  **Add sudo rule for Jenkins:**
    ```bash
    echo "jenkins ALL=(ALL) NOPASSWD: /usr/bin/apt-get" | sudo tee /etc/sudoers.d/jenkins
    ```
    *   **Beginner Explanation:** This command creates a file that tells your system that the `jenkins` user can run `apt-get` commands (for installing software) without needing a password. This is a very specific permission and should be used cautiously.
    *   **Security Warning (Advanced):** Granting `NOPASSWD` sudo access is generally discouraged in production environments due to security risks. It's better to use more secure methods like Docker group membership or dedicated service accounts with minimal privileges. This example provides a quick solution for development/testing.

## 12. Troubleshooting SonarQube Timeout Issues

If you encounter a `Cancelling nested steps due to timeout` error related to SonarQube in your Jenkins pipeline, it often indicates that SonarQube cannot communicate back to Jenkins. This is typically due to network configuration, especially when Jenkins is behind a NAT or Docker network.

### Error Message Example:

```
Checking status of SonarQube task 'AZx61Sfz9xLaYDsVjPAX' on server 'sonarqube'
SonarQube task 'AZx61Sfz9xLaYDsVjPAX' status is 'IN_PROGRESS'
Cancelling nested steps due to timeout
[Pipeline] }
```

### Solution: Configure SonarQube Webhooks with Internal IP

SonarQube needs to send a webhook back to Jenkins to update the analysis status. If Jenkins is running on a private IP (e.g., within a Docker network or a local machine), SonarQube won't be able to reach it using the public ngrok URL. You need to tell SonarQube the internal IP address of your Jenkins instance.

1.  **Find your server's internal IP address:**
    ```bash
    hostname -I
    ```
    *   **Beginner Explanation:** This command displays all IP addresses assigned to your server. You're looking for an internal IP, typically starting with `172.x.x.x` or `192.168.x.x`.
    *   **Example Output:**
        ```
        furkan@DESKTOP-M5SA76T:~$ hostname -I
        172.31.66.217 172.17.0.1 172.18.0.1 172.19.0.1
        furkan@DESKTOP-M5SA76T:~$
        ```
        In this example, `172.31.66.217` or `172.17.0.1` (if Jenkins is in a Docker network) could be the relevant IP.

2.  **Configure SonarQube Webhook:**
    *   Log in to SonarQube as an administrator.
    *   Go to **Administration → Configuration → Webhooks**.
    *   **Create a new webhook** and set the URL as:
        `http://YOUR_INTERNAL_IP:8080/sonarqube-webhook/`
        *   **Example:** `http://172.31.66.217:8080/sonarqube-webhook/`
    *   **Beginner Explanation:** This webhook tells SonarQube to send analysis results to Jenkins using its internal IP address and port `8080` (where Jenkins is listening). This bypasses the ngrok tunnel for internal communication, which is more reliable.
    *   **Advanced Note:** Ensure firewall rules allow communication between the SonarQube container and the Jenkins host on port `8080`.

## 13. GitHub Personal Access Token (PAT) for Jenkins (for private repos or advanced permissions)

If your GitHub repository is private, or if you need Jenkins to perform actions that require more than just webhook triggers (e.g., updating commit statuses), you'll need to use a Personal Access Token (PAT).

### Option 1: Personal Access Token (PAT)

This is the most common and recommended method for authenticating Jenkins with GitHub.

#### Step A: Generate the Token on GitHub

1.  Go to your GitHub **Settings** (click your profile icon → `Settings`).
2.  Scroll down to **Developer settings → Personal access tokens → Tokens (classic)**.
3.  Click **Generate new token (classic)**.
4.  **Note:** Give it a descriptive name (e.g., `Jenkins-Webhook-Token`).
5.  **Select Scopes:** This is critical. Choose the minimum necessary permissions:
    *   `repo` (Full control of private repositories) - *Necessary for Jenkins to clone private repos.*
    *   `admin:repo_hook` (Full control of repository hooks) - *Vital for fixing 403 errors related to webhook management.*
6.  Click **Generate token** and **copy it immediately**. You will not be able to see it again after this page! (Example: `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`)
    *   **Beginner Explanation:** A PAT is like a special password that grants specific permissions to applications like Jenkins, allowing them to interact with your GitHub account without using your main password. You generate it once and keep it secret.
    *   **Security Warning (Advanced):** Treat PATs like passwords. Do not hardcode them in scripts or commit them to repositories. Use Jenkins credentials management for secure storage.

#### Step B: Add PAT to Jenkins Credentials

1.  In Jenkins, go to **Manage Jenkins → Credentials → System → Global credentials (unrestricted)**.
2.  Click **Add Credentials**.
3.  **Kind:** Select `Secret text`.
4.  **Secret:** Paste the copied GitHub PAT here.
5.  **ID:** Give it a name like `github-token`.
6.  **Description:** (Optional) `GitHub PAT for Jenkins`.
7.  Click **Create**.
    *   **Beginner Explanation:** Similar to the SonarQube token, you're securely storing your GitHub PAT in Jenkins.

#### Step C: Configure GitHub Server in Jenkins (Optional, but Recommended)

1.  In Jenkins, go to **Manage Jenkins → System → GitHub** section.
2.  Click **Add GitHub Server**.
3.  **Name:** `GitHub` (or a descriptive name).
4.  **Credentials:** Select your newly created `github-token` from the dropdown.
5.  Click **Test Connection** to ensure Jenkins can connect to GitHub using the PAT.
6.  Click **Save**.
    *   **Beginner Explanation:** This step configures Jenkins to use your GitHub PAT for general GitHub interactions, improving reliability and enabling more advanced features.

## Conclusion

This comprehensive guide has walked you through setting up a robust CI/CD pipeline using Docker, Jenkins, SonarQube, ngrok, and GitHub. By following these steps, you can automate your development workflow, improve code quality, and streamline deployments. Remember to adapt these configurations to your specific project needs and always prioritize security in production environments.

---

**Author:** Furkan
