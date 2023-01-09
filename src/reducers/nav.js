import { Container } from '../containers/Container';

const initialState = Container.router.getStateForAction(Container.router.getActionForPathAndParams('Load'));

const nav = (state = initialState, action) => {
  const nextState = Container.router.getStateForAction(action, state);
  return nextState || state;
};

export default nav;
