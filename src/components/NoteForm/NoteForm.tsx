import { useId } from "react";
import css from "./NoteForm.module.css";
import { Form, Formik, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import type { Note } from "../../types/note";
import { createNote } from "../../services/noteService";
import { useMutation } from '@tanstack/react-query';

const initialValues: Note = {
    id: 0,
    title: "",
    content: "",
    tag: "Todo",
};

interface NoteFormProps {
    onClose: () => void,
    onMutation: (value:boolean) => void,
}

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "title is too short")
        .max(50, "title is too long")
        .required("title is required"),
    content: Yup.string()
        .max(500, "content is too long"),
    tag: Yup.string()
        .oneOf(["Todo", "Work", "Shopping", "Meeting", "Persona;"], "you invalid")
        .required("tag is required")
    
});

export default function NoteForm({ onClose,onMutation}:NoteFormProps) {
    const formId = useId();
    const mutation = useMutation({
        mutationFn: async (values: Note) => {
            createNote(values);
        },
        onSuccess: () => {
            onMutation(true);
            onClose();
        }
    });

    const handleSubmit = (
        values: Note,
        actions: FormikHelpers<Note>
    ) => {
        mutation.mutate(values);
        console.log('Form submitted:', values);
        actions.resetForm();
    };



    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}    
        >

            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor={`${formId}-title`}>Title</label>
                    <Field id={`${formId}-title`} type="text" name="title" className={css.input} />
                    <ErrorMessage component="span" name="title" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor={`${formId}-content`}>Content</label>
                    <Field as ="textarea"
                        id={`${formId}-content`}
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage component="span" name="content" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor={`${formId}-tag`}>Tag</label>
                    <Field as="select" id={`${formId}-tag`} name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field >
                    <ErrorMessage component="span" name="tag" className={css.error} />
                </div>

                <div className={css.actions}>
                    <button onClick={ onClose} type="button" className={css.cancelButton}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={false}
                    >
                        Create note
                    </button>
                </div>
            </Form>
        </Formik>
    );
}