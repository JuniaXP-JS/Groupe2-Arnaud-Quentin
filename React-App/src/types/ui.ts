// Type for sidebar configuration
export interface SidebarState {
    state: 'expanded' | 'collapsed';
}

export interface SidebarContextType {
    state: 'expanded' | 'collapsed';
    setState: (state: 'expanded' | 'collapsed') => void;
}

/**
 * Props for a generic form field.
 */
export interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Props for a button component.
 */
export interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}

/**
 * Props for a table component.
 */
export interface TableProps {
    headers: string[];
    data: Record<string, any>[];
    onRowClick?: (row: Record<string, any>) => void;
}

/**
 * Props for a modal component.
 */
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

/**
 * Menu item for sidebar or navigation.
 */
export type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};