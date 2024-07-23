def generate_config(context):
    resources = [{
        'name': 'customer-concern-topic',
        'type': 'pubsub.v1.topic',
        'properties': {
            'topic': 'customer-concern'
        }
    }, {
        'name': context.env['name'] + '-function',
        'type': 'gcp-types/cloudfunctions-v1:projects.locations.functions',
        'properties': {
            'parent': 'projects/{}/locations/{}'.format(context.env['project'], context.properties['region']),
            'function': context.env['name'] + '-function',
            'location': context.properties['region'],
            'entryPoint': 'processPubSubMessage',
            'runtime': 'nodejs18',
            'eventTrigger': {
                'eventType': 'google.pubsub.topic.publish',
                'resource': 'projects/' + context.env['project'] + '/topics/customer-concern'
            },
            'sourceArchiveUrl': context.properties['sourceArchiveUrl']
        }
    }]
    return {'resources': resources}
