pipeline {
    agent any

    // Make the SonarQube scanner CLI available on the agent
    tools {
       // sonarQubeScanner 'sonar-scanner'
       'hudson.plugins.sonar.SonarRunnerInstallation' 'sonar-scanner'
    }

    environment {
        // Secret text credential in Jenkins that stores the SonarQube token
        // (Manage Jenkins -> Credentials -> ID = 'sonarqube-token')
        SONAR_TOKEN = credentials('sonarqube-token')
    }

    stages {

        stage('Checkout') {
            steps {
                // Pull the latest version of this repo from GitHub
                git url: 'https://github.com/furkanGitId/todo-cicd-pipeline.git', branch: 'main'
            }
        }

        stage('Install System Dependencies') {
            steps {
                sh '''
                    sudo apt-get install -y \
                        build-essential \
                        unixodbc \
                        unixodbc-dev \
                        python3 \
                        make \
                        g++
                '''
            }
        }

        stage('Verify Tools') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Frontend: Install & Lint') {
            steps {
                dir('frontend') {
                    // Deterministic install for CI; uses package-lock.json if present
                    sh 'npm ci'

                    // Run ESLint to catch style and obvious code issues early
                    sh 'npm run lint'

                    // Build the production-ready frontend bundle
                    sh 'npm run build'
                }
            }
        }

        stage('Backend: Install Dependencies') {
            steps {
                dir('backend') {
                    // Install backend dependencies (no automated tests defined yet)
                    // --omit=dev matches how the Dockerfile builds a slim image
                    sh 'npm ci --omit=dev'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Uses the SonarQube server configuration in Jenkins
                // (Manage Jenkins -> Configure System -> SonarQube servers)
                withSonarQubeEnv('sonarqube') {
                    sh "echo 'Scanner path: ${tool 'sonar-scanner'}'"
                    sh "ls ${tool 'sonar-scanner'}/bin/"
                    sh """
                        ${tool 'sonar-scanner'}/bin/sonar-scanner \
                        -Dsonar.projectKey=todo-cicd-pipeline \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                // Wait for SonarQube background analysis to finish.
                // If the quality gate fails (e.g. too many bugs, low coverage),
                // this will mark the Jenkins build as failed and stop the pipeline.
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                // Build the backend and frontend images using the docker-compose.yml file.
                // This uses the "build" sections under each service, so Dockerfiles in
                // ./backend and ./frontend are respected and images get tagged as in compose.
                sh 'docker-compose -f docker-compose.yml build'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                // Recreate the full stack (backend + frontend) using docker-compose.
                // 'down' is made non-fatal so the first run (no containers yet) still succeeds.
                sh '''
                    docker-compose -f docker-compose.yml down --remove-orphans || true
                    docker rm -f todo-backend todo-frontend || true
                    docker-compose -f docker-compose.yml up -d
                '''
            }
        }
    }

    post {
        failure {
            // Simple notification hook point for alerts or logs aggregators
            echo 'Pipeline failed. Check the stage logs above for details.'
        }
    }
}