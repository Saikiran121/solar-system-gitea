pipeline {
    agent any 

    stages {
        stage('Node version') {
            steps {
                sh '''
                    node -v
                    npm -v
                '''
            }
        }
    }
}

