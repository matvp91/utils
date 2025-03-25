import type { IntendedAny } from "./types";

interface Target {
  addEventListener?: Handler;
  removeEventListener?: Handler;
  on?: Handler;
  off?: Handler;
  prependEventListener?: Handler;
}

type AddCallback<T extends Target> = T extends { addEventListener: Handler }
  ? T["addEventListener"]
  : T extends { on: Handler }
    ? T["on"]
    : Handler;

type RemoveCallback<T extends Target> = T extends {
  removeEventListener: Handler;
}
  ? T["removeEventListener"]
  : T extends { off: Handler }
    ? T["off"]
    : Handler;

export class EventManager {
  private bindings_ = new Set<Binding>();

  listen = <T extends Target>(target: T, prepend?: boolean) =>
    ((type, listener, ...rest) => {
      const binding = createBinding(
        target,
        type,
        listener,
        false,
        prepend,
        rest,
      );
      this.bindings_.add(binding);
    }) as AddCallback<T>;

  listenOnce = <T extends Target>(target: T, prepend?: boolean) =>
    ((type, listener, ...rest) => {
      const binding = createBinding(
        target,
        type,
        listener,
        true,
        prepend,
        rest,
      );
      this.bindings_.add(binding);
    }) as AddCallback<T>;

  unlisten = <T extends Target>(target: T) =>
    ((type, listener) => {
      const binding = Array.from(this.bindings_).find(
        (binding) =>
          binding.target === target &&
          binding.type === type &&
          binding.listener === listener,
      );
      if (binding) {
        binding.remove();
        this.bindings_.delete(binding);
      }
    }) as RemoveCallback<T>;

  removeAll() {
    for (const binding of this.bindings_) {
      binding.remove();
    }
    this.bindings_.clear();
  }
}

/**
 * Create a binding for a specific target.
 * @param target
 * @param type
 * @param listener
 * @param context
 * @param once
 * @returns
 */
function createBinding(
  target: Target,
  type: string,
  listener: Handler,
  once?: boolean,
  prepend?: boolean,
  rest: IntendedAny[] = [],
) {
  const methodMap = {
    add: target.addEventListener?.bind(target) ?? target.on?.bind(target),
    remove:
      target.removeEventListener?.bind(target) ?? target.off?.bind(target),
    prepend: target.prependEventListener,
  };

  const remove = () => {
    methodMap.remove?.(type, callback);
  };

  const callback = async (...args: unknown[]) => {
    try {
      await listener.apply(undefined, args);
      if (once) {
        remove();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (prepend && methodMap.prepend) {
    methodMap.prepend(type, callback, ...rest);
  } else {
    methodMap.add?.(type, callback, ...rest);
  }

  return {
    target,
    type,
    listener,
    once,
    remove,
  };
}

type Binding = ReturnType<typeof createBinding>;

type Handler = (...args: IntendedAny) => IntendedAny;
