import BidirectionalIntegration, {
    DiscoveryBaseMessage,
} from '../../common/integration/BidrectionalIntegration';
import { MessageType } from '../../common/integration/Integration';
import { SentenceNode } from '.';

export interface SentenceDiscoveryPayload extends DiscoveryBaseMessage {
    type: MessageType.SentenseTrigger;
    sentences: string[];
}

export default class SentenceIntegration extends BidirectionalIntegration<SentenceNode> {
    protected getDiscoveryPayload(): SentenceDiscoveryPayload {
        return {
            type: MessageType.SentenseTrigger,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            server_id: this.node.config.server!,
            sentences: this.node.config.sentences,
        };
    }
}
