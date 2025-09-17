pipeline {
    agent any 

    tools {
        nodejs 'NodeJS-22-6-0'
    }

    environment {
        MONGO_URI = "mongodb+srv://saikiranbiradar76642_db_user:wOtaomBiiL4bOUF3@cluster0.sghaem5.mongodb.net/superData?retryWrites=true&w=majority"
    }

    stages {
        stage('Installing Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }

        stage("dependency Scanning") {
            parallel {
                stage('NPM Dependency Audit') {
                    steps {
                        sh '''
                            npm audit --audit-level=critical
                            echo $?
                        '''
                    }
                }

                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '''
                            --scan .
                            --out ./dependency-check-report
                            --format ALL
                            --prettyPrint
                        ''',
                        odcInstallation: 'OWASP-DepCheck-12'

                        dependencyCheckPublisher failedTotalCritical: 1, pattern: '**/dependency-check-report/dependency-check-report.xml', stopBuild: true

                        junit allowEmptyResults: true, stdioRetention: '', testResults: './dependency-check-report/dependency-check-junit.xml'

                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './dependency-check-report/', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
                    }
                }

                stage('Unit Testing') {
                    steps {
                        withCredentials([usernamePassword(credentialsId: 'mongo-db-credentials', passwordVariable: 'MONGO_PASSWORD', usernameVariable: 'MONGO_USERNAME')]) {
                            sh '''
                            ATLAS_HOST="cluster0.sghaem5.mongodb.net"
                            DBNAME="superData"
                            export MONGO_URI="mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${ATLAS_HOST}/${DBNAME}?retryWrites=true&w=majority"
                            npm test 
                            '''
                        }  

                        junit allowEmptyResults: true, stdioRetention: '', testResults: 'test-results.xml'

                    }
                }
            }
        }
        
    }
}

