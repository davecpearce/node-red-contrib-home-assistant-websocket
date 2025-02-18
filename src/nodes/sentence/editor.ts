import { EditorNodeDef, EditorNodeProperties, EditorRED } from 'node-red';

import { NodeType, TypedInputTypes } from '../../const';
import * as haOutputs from '../../editor/components/output-properties';
import * as exposeNode from '../../editor/exposenode';
import ha, { NodeCategory, NodeColor } from '../../editor/ha';
import * as haServer from '../../editor/haserver';
import { OutputProperty } from '../../editor/types';

declare const RED: EditorRED;

interface SentenceEditorNodeProperties extends EditorNodeProperties {
    server: string;
    version: number;
    sentences: string[];
    outputProperties: OutputProperty[];
}

const SentenceEditor: EditorNodeDef<SentenceEditorNodeProperties> = {
    category: NodeCategory.HomeAssistant,
    color: NodeColor.Beta,
    outputs: 1,
    outputLabels: '',
    icon: 'font-awesome/fa-comment-o',
    paletteLabel: 'sentence',
    label: function () {
        return this.name || `sentence`;
    },
    labelStyle: ha.labelStyle,
    defaults: {
        name: { value: '' },
        server: { value: '', type: NodeType.Server, required: true },
        version: { value: RED.settings.get('haSentenceVersion', 0) },
        outputs: { value: 1 },
        sentences: { value: [], validate: (s) => s.length > 0 },
        outputProperties: {
            value: [
                {
                    property: 'topic',
                    propertyType: 'msg',
                    value: '',
                    valueType: TypedInputTypes.TriggerId,
                },
                {
                    property: 'payload',
                    propertyType: 'msg',
                    value: '',
                    valueType: TypedInputTypes.TriggerId,
                },
            ],
            validate: haOutputs.validate,
        },
    },
    oneditprepare: function () {
        ha.setup(this);
        haServer.init(this, '#node-input-server');
        exposeNode.init(this);

        $('#dialog-form').prepend(ha.betaWarning(981));

        $('#node-input-sentences-container')
            .editableList({
                addButton: true,
                removable: true,
                height: 'auto',
                header: $('<div>').append(
                    this._('ha-sentence.label.sentences')
                ),
                addItem: function (container, _, data: string) {
                    $('<input />', {
                        type: 'text',
                        value: typeof data === 'string' ? data : '',
                        style: 'width: 100%',
                    }).appendTo(container);
                },
            })
            .editableList(
                'addItems',
                (this.sentences.length ? this.sentences : ['']) as any
            );

        haOutputs.createOutputs(this.outputProperties, {
            extraTypes: ['triggerId'],
        });
    },
    oneditsave: function () {
        const _sentences: string[] = [];
        $('#node-input-sentences-container')
            .editableList('items')
            .each(function () {
                const $text = $(this).find('input');
                const value = $text.val() as string;
                // only add if not empty
                if (value) _sentences.push(value);
            });
        this.sentences = _sentences;
        this.outputProperties = haOutputs.getOutputs();
    },
};

export default SentenceEditor;
