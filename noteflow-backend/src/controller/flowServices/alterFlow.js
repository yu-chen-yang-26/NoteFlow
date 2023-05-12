import { Flow, Node, Edge } from '../../model/mongodb/model/index.js';

const ACTIONS_AVAILABLE = ['add', 'remove', 'alter'];
const TYPE_AVAILABLE = ['node', 'edge', 'title'];

const alterFlow = async (ctx) => {
  const { flowId, owner, type, action } = ctx.request.body;
  let { component } = ctx.request.body;

  // TODO: 後端不會處理 Conflict, 必須要在 Message 端處理

  if (!ctx.session.email) {
    ctx.throw(401, "Unauthorized. You haven't log in yet.");
  }
  if (!flowId || !type || !component || !action || !owner) {
    ctx.throw(
      400,
      "Bad Request. You didn't proivde sufficient information in one of the field: [flowId, type, component, action].",
    );
  }
  if (!(action in ACTIONS_AVAILABLE)) {
    ctx.throw(
      405,
      'Action not allowed. You provided an action that is not available. Available actions are of below: [add, remove, alter].',
    );
  }
  if (!(type in TYPE_AVAILABLE)) {
    ctx.throw(
      405,
      'Type not allowed. You should provide type that is in [node, edge or title].',
    );
  }
  if (type === 'title' && action in ['add', 'remove']) {
    ctx.throw(405, 'Action not allowed. Title can only be altered');
  }
  const canEdit =
    ctx.session.email === owner ||
    (await Flow.CanUserEdit(flowId, owner, ctx.session.email));
  if (!canEdit) {
    ctx.throw(403, 'Forbidden. You are not invited into this flow.');
  }

  component = handleComponent(component, type);
  if (component.validate()) {
    ctx.throw(400, 'You provided insufficient component.');
  }

  try {
    if (action === 'add') {
      Flow.addComponent(flowId, owner, type, component);
      if (component instanceof Node) {
        component.addEditor();
      }
    } else if (action === 'remove') {
      Flow.removeComponent(flowId, owner, type, component);
    } else {
      Flow.alterComponent(flowId, owner, type, component);
    }
  } catch (e) {
    ctx.throw(404, 'Flow not found.');
  }

  ctx.status = 200;
};

const handleComponent = (component, type) => {
  let result = component;
  if (type === 'node') {
    const { id, type, owner, collaborators } = component;
    result = new Node(id, type, owner, collaborators);
  } else if (type === 'edge') {
    const { edgeId, type, source, sourceHandle, target, targetHandle, style } =
      component;
    result = new Edge(
      id,
      type,
      source,
      sourceHandle,
      target,
      targetHandle,
      style,
    );
  } else {
    result = new Title(result);
  }

  return result;
};

export default alterFlow;
