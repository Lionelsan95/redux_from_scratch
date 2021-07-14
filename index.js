
        function createStore(reducer){
            let state
            let listeners = []

            const getState = () => (state)

            const subscribe = (listener) => {
                listeners.push(listener)
                return () => {
                    listeners = listeners.filter( l => l != listener)
                }
            }

            const dispatch = (action) => {
                state = reducer(state, action)
                listeners.forEach((listener) => listener())
            }

            return {
                getState,
                subscribe,
                dispatch
            }
        }

        const   ADD_TODO = 'ADD_TODO',
                REMOVE_TODO = 'REMOVE_TODO',
                TOGGLE_TODO = 'TOGGLE_TODO',
                ADD_GOAL = 'ADD_GOAL',
                REMOVE_GOAL = 'REMOVE_GOAL'

        function addTodoAction (todo) {
            return {
                type: ADD_TODO,
                todo
            }
        }
        function removeTodoAction(id){
            return {
                type: REMOVE_TODO,
                id
            }
        }

        function toggleTodoAction(id){
            return {
                type: TOGGLE_TODO,
                id
            }
        }

        function addGoalAction(goal){
            return {
                type: ADD_GOAL,
                goal
            }
        }

        function removeGoalAction(id){
            return {
                type: REMOVE_GOAL,
                id
            }
        }

        const todos = (state = [], action) => {
            switch(action.type){
                case ADD_TODO:
                    return state.concat(action.todo)
                case REMOVE_TODO:
                    return state.filter(tod => tod.id !== action.id)
                case TOGGLE_TODO:
                    return state.map((tod) => tod.id !== action.id ? tod: Object.assign({}, tod, {complete: !tod.complete}))
                default:
                    return state
            }
        }

        const goals = (state = [], action) => {
            switch(action.type){
                case ADD_GOAL:
                    return [...state, action.goal]
                case REMOVE_GOAL:
                    return state.filter(goal => goal.id !== action.id)
                default:
                    return state
            }    
        }

        function app(state = {}, action) {
            return {
                todos: todos(state.todos, action),
                goals: goals(state.goals, action)
            }
        }

        const store = createStore(app)

        store.subscribe(() => {
            const {goals, todos} = store.getState()

            document.getElementById('todos').innerHTML = ''
            document.getElementById('goals').innerHTML = ''
            
            goals.forEach(addGoalToDOM)
            todos.forEach(addTodoToDOM)
        })

        document.getElementById('todoBtn').addEventListener('click', addTodo)
        document.getElementById('goalBtn').addEventListener('click', addGoal)

        const generateId = () => (
            Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
        )


        function addTodo(){
            const   input = document.getElementById('todo')
                    name = input.value;
            input.value = ''

            if(name.trim() !== '')
                store.dispatch(addTodoAction({
                    name,
                    complete: false,
                    id: generateId()
                }))
        }

        function addGoal(){            
            const   input = document.getElementById('goal')
                    name = input.value;
            input.value = ''

            if(name.trim() !== '')
                store.dispatch(addGoalAction({
                    name,
                    id: generateId()
                })) 
        }

        function createRemoveButton(onClick){
            const removeBtn = document.createElement('button')
            removeBtn.innerHTML = 'X'
            removeBtn.addEventListener('click', onClick)
            return removeBtn
        }

        function addTodoToDOM(todo){
            const   node = document.createElement('li'),
                    text = document.createTextNode(todo.name),
                    removeBtn = createRemoveButton(() => {
                        store.dispatch(removeTodoAction(todo.id)) 
                    })
            
            node.appendChild(text)
            node.appendChild(removeBtn)
            node.style.textDecoration = todo.complete ? 'line-through' : 'none'

            node.addEventListener('click', () => {
                store.dispatch(toggleTodoAction(todo.id)) 
            })

            document.getElementById('todos')
                .appendChild(node)
        }

        function addGoalToDOM(goal){
            const   node = document.createElement('li'),
                    text = document.createTextNode(goal.name),
                    removeBtn = createRemoveButton(() => {
                        store.dispatch(removeGoalAction(goal.id)) 
                    })

            node.appendChild(text)
            node.appendChild(removeBtn)
            node.style.textDecoration = goal.complete ? 'line-through' : 'none'            

            document.getElementById('goals')
                .appendChild(node)            
        }
