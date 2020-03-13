import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecr = require('@aws-cdk/aws-ecr');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import cdk = require('@aws-cdk/core');

class BonjourFargate extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 }); //To create stack on a new VPC
    //const vpc = ec2.Vpc.fromLookup(this, 'VPC', {isDefault: true}); //To create stack on existed VPC
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    // Instantiate Fargate Service with just cluster and image
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster,
      assignPublicIp: true,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(ecr.Repository.fromRepositoryName(this,"384612698411.dkr.ecr.ap-southeast-1.amazonaws.com","golang-gin-ecs-fargate")),
        environment: { 'PORT':'80' }
      },
    });
  }
}

const app = new cdk.App();

new BonjourFargate(app, 'golang-workshop-0313',{ 
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
}});

app.synth();
