node{
  def commit_id  
  stage('NewMan test'){
    checkout scm
    sh "git rev-parse --short HEAD > .git/commit-id"
    commit_id = readFile('.git/commit-id').trim()
  }
  stage('test'){
      sh 'node ./test/INTVAL.js -d ./test/intval_input.json'
  }
  
}
